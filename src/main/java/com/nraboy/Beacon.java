package com.nraboy;

/*
 * IoT iBeacon Scanner
 * Created by Nic Raboy at Couchbase
 */

import com.couchbase.lite.*;
import java.net.InetAddress;
import java.util.*;

public class Beacon {

    private String beacon;
    private int power;
    private String gateway;
    private long timestamp;
    private String uuid;
    private int major;
    private int minor;

    public Beacon(String[] properties) {
        this.uuid = properties[0];
        this.major = Integer.parseInt(properties[1]);
        this.minor = Integer.parseInt(properties[2]);
        this.beacon = properties[0] + "::" + Integer.parseInt(properties[1]) + "::" + Integer.parseInt(properties[2]);
        this.power = Integer.parseInt(properties[3]);
        try {
            String[] inet = InetAddress.getLocalHost().toString().split("/");
            this.gateway = inet[0] + "::" + inet[1];
        } catch (Exception e) {
            this.gateway = "unknown::0000";
        }
        this.timestamp = System.currentTimeMillis();
    }

    public String getUUID() {
        return this.uuid;
    }

    public int getMajor() {
        return this.major;
    }

    public int getMinor() {
        return this.minor;
    }

    public String save(Database database) {
        String docId = "";
        Map<String, Object> properties = new HashMap<String, Object>();

        Document document = database.createDocument();
        properties.put("type", "status");
        properties.put("beacon", this.uuid + "::" + Integer.toString(this.major) + "::" + Integer.toString(this.minor));
        properties.put("power", this.power);
        properties.put("gateway", this.gateway);
        properties.put("timestamp", this.timestamp);

        try {
            docId = document.putProperties(properties).getDocument().getId();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return docId;
    }

    public void print() {
        System.out.println(this.beacon + "\t\t" + this.major + "\t\t" + this.minor + "\t\t" + this.power + "\t\t" + this.gateway + "\t\t" + this.timestamp);
    }

}
