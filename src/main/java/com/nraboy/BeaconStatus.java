package com.nraboy;

/*
 * IoT iBeacon Scanner
 * Created by Nic Raboy at Couchbase
 */

import java.net.InetAddress;

public class BeaconStatus {

    private int power;
    private long createdAt;
    private String gatewayDevice;

    public BeaconStatus(int power) {
        this.power = power;
        this.createdAt = System.currentTimeMillis();
        try {
            this.gatewayDevice = InetAddress.getLocalHost().toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int getPower() {
        return this.power;
    }

    public long getCreatedAt() {
        return this.createdAt;
    }

    public String getGatewayDevice() {
        return this.gatewayDevice;
    }

}
