package com.nraboy;

/*
 * IoT iBeacon Scanner
 * Created by Nic Raboy at Couchbase
 */

import com.couchbase.lite.*;
import com.couchbase.lite.replicator.Replication;
import java.net.URL;

public class App {

    public static void main(String[] args) {

        final Beacon beacon = new Beacon(args.length == 4 ? args : new String[] { "nraboy", "0", "1", "-45" });
        beacon.print();

        final Manager manager;
        final Database database;

        try {
            manager = new Manager(new JavaContext("data"), Manager.DEFAULT_OPTIONS);
            database = manager.getDatabase("iot-project");
            URL url = new URL("http://10.0.1.62:4984/default/");
            final Replication push = database.createPushReplication(url);
            push.setContinuous(false);
            push.addChangeListener(new Replication.ChangeListener() {
                @Override
                public void changed(Replication.ChangeEvent event) {
                    if(event.getSource().getStatus() == Replication.ReplicationStatus.REPLICATION_STOPPED) {
                        System.exit(1);
                    }
                }
            });
            beacon.save(database);
            push.start();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
