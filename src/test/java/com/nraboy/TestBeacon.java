package com.nraboy;

/*
 * IoT iBeacon Scanner
 * Created by Nic Raboy at Couchbase
 */

import static junit.framework.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

import com.couchbase.lite.Database;
import com.couchbase.lite.JavaContext;
import com.couchbase.lite.Manager;
import org.junit.Test;

public class TestBeacon {

    private Manager manager;
    private Database database;

    public TestBeacon() {
        try {
            this.manager = new Manager(new JavaContext("data"), Manager.DEFAULT_OPTIONS);
            this.database = this.manager.getDatabase("iot-project-test");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testSave() {
        // Make sure saving the iBeacon data returns a valid document id
        String docId1 = (new Beacon(new String[] { "12345", "0", "1", "-45" })).save(this.database);
        assertNotEquals(docId1, "");
    }

}
