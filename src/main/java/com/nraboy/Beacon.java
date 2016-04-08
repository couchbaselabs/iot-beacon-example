package com.nraboy;

/*
 * IoT iBeacon Scanner
 * Created by Nic Raboy at Couchbase
 */

import com.couchbase.lite.*;
import java.util.*;

public class Beacon {

    private String uuid;
    private int major;
    private int minor;
    private BeaconStatus beaconStatus;

    public Beacon(String[] properties) {
        this.uuid = properties[0];
        this.major = Integer.parseInt(properties[1]);
        this.minor = Integer.parseInt(properties[2]);
        this.beaconStatus = new BeaconStatus(Integer.parseInt(properties[3]));
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
        ArrayList<BeaconStatus> beaconStatusList = new ArrayList<BeaconStatus>();

        Document document = this.load(database);

        if(document != null) {
            properties.putAll(document.getProperties());
            beaconStatusList = (ArrayList<BeaconStatus>) properties.get("beaconStatus");
        } else {
            document = database.createDocument();
            properties.put("uuid", this.uuid);
            properties.put("major", this.major);
            properties.put("minor", this.minor);
        }

        beaconStatusList.add(this.beaconStatus);

        properties.put("beaconStatus", beaconStatusList);

        try {
            docId = document.putProperties(properties).getDocument().getId();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return docId;
    }

    private Document load(Database database) {
        Document document = null;
        try {
            View beaconView = database.getView("beacons");
            beaconView.setMap(new Mapper() {
                @Override
                public void map(Map<String, Object> document, Emitter emitter) {
                    List<Object> keys = new ArrayList<Object>();
                    keys.add(document.get("uuid"));
                    keys.add(document.get("major"));
                    keys.add(document.get("minor"));
                    emitter.emit(keys, document.get("beaconStatus"));
                }
            }, "1");
            Query query = beaconView.createQuery();
            List<Object> keys = new ArrayList<Object>();
            List<Object> key = new ArrayList<Object>();
            key.add(this.uuid);
            key.add(this.major);
            key.add(this.minor);
            keys.add(key);
            query.setKeys(keys);
            QueryEnumerator result = query.run();
            for (Iterator<QueryRow> it = result; it.hasNext(); ) {
                QueryRow row = it.next();
                document = row.getDocument();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return document;
    }

    public void print() {
        System.out.println(this.uuid + "\t\t" + this.major + "\t\t" + this.minor + "\t\t" + this.beaconStatus.getPower() + "\t\t" + this.beaconStatus.getCreatedAt());
    }

}
