# IoT Couchbase Beacon Project

An example project that will scan for iBeacons from a Yocto Linux (or similar) IoT device.  iBeacons will be piped from the [Radius Networks](http://developer.radiusnetworks.com/ibeacon/idk/ibeacon_scan) scan script into a Java application that will save the transaction information to Couchbase Server via Couchbase Lite for Java and Couchbase Sync Gateway.

Each iBeacon transaction will be stored as an embedded document.  This means that one document will exist per unique iBeacon.  All status information such as timestamps and power will be stored as an array within the same document.  For example:

```json
{
    "uuid": "74278BDA-B644-4520-8F0C-720EAF059935",
    "major": 1,
    "minor": 0,
    "beaconStatus": [
        {
            "power": -45,
            "gatewayDevice": "macbook",
            "createdAt": 1460150563819
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

## Resources

Couchbase - http://developer.couchbase.com
