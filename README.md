# IoT Couchbase Beacon Project

This IoT project will scan for portable bluetooth iBeacons and save their information to a Couchbase NoSQL database.

Possible use cases (not limited to):

* Maybe airliners attach iBeacons to luggage that has been checked-in for transport and IoT scanners are dispersed at airports.  Luggage location could be tracked and less will become lost.

* Maybe amusement parks like Disney keep IoT scanners running at various locations around their parks.  iBeacon bracelets or fabs could be given to small children so if they become lost in the park, they could easily be found.

To be more specific about the technical details, this project will run on an IoT device such as an Intel IoT Gateway and continuously scan for bluetooth signals that match the iBeacon specification.  Scanning uses the `hcitool` and `hcidump` tools found on Yocto and other Linux distribution flavors.  To make bluetooth parsing simple, this project will use the **iBeacon Scan** script by [Radius Networks](http://developer.radiusnetworks.com/ibeacon/idk/ibeacon_scan) to parse the `hcidump` data.  Once parsed, the data will be piped into the Java application that will save the data into Couchbase Server via Couchbase Lite for Java and the Couchbase Sync Gateway.

Each iBeacon transaction will be stored as an embedded document.  This means that one document will exist per unique iBeacon.  All status information such as timestamps and power will be stored as an array within the same document.  For example:

```json
{
    "uuid": "74278BDA-B644-4520-8F0C-720EAF059935",
    "major": 1,
    "minor": 0,
    "beaconStatus": [
        {
            "power": -45,
            "gatewayDevice": "kitchen",
            "createdAt": 1460150563819
        },
        {
            "power": -59,
            "gatewayDevice": "bathroom",
            "createdAt": 1460150583234
        }
    ]
}
```

This setup has been tested using an Intel IoT Gateway.

## Requirements

There are a few requirements to use this application.

* Couchbase Sync Gateway
* Maven
* JDK 1.7 (version dependent on IoT JRE)
* An IoT device with BLE (Intel IoT Gateway and Intel Edison recommended)

## Configuration

The Java project contains hardcoded information in regards to the location of the Couchbase Sync Gateway.  Open **src/main/java/com/nraboy/App.java** and change the URL to match that of your own.

## Installation

This project must be built via a workstation before transferring to the IoT device.  To build the Java project, execute the following via a Command Prompt (Windows) or Terminal (Mac and Linux):

```sh
mvn package
```

Transfer the JAR file that contains dependencies found in the **target** directory, to the IoT device.  The scanning script expects the JAR file to be named **iot-couchbase-project.jar**.  Also transfer the **ibeacon_scan** script to the IoT device and place it in the same directory as **iot-couchbase-project.jar**.

Scanning for iBeacons and saving them to Couchbase can be started by executing the following:

```sh
./ibeacon_scan
```

The script will run until manually stopped.

![iBeacon Couchbase Example](/iot-couchbase-ibeacon-example.gif)

## Troubleshooting

If you experience the following error when trying to run via your IoT device:

```
Library not found: /native/linux/i386/libsqlite3.so
```

You will have to do some hacking when it comes to your JAR file.  By default, only **amd64**, **x86**, and **x86_64** directories exist for the SQLite libraries.  We must create an **i386** directory.

Extract the compiled JAR file using the following command:

```sh
jar xvf <filename>.jar
```

Navigate into **native/linux** directory of the extracted jar and rename **x86** to **i386**.  Recompile the JAR by executing the following:

```sh
jar cvfm iot-couchbase-project.jar META-INF/MANIFEST.MF .
```

The application should work now.

## Resources

Couchbase - http://developer.couchbase.com

Intel IoT Gateway - https://www-ssl.intel.com/content/www/us/en/service-gateway/service-gateway-overview.html

Gimbal - http://www.gimbal.com/
