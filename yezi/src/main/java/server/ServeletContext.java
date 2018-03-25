package server;

import java.util.HashMap;
import java.util.Map;

public class ServeletContext {
    // 为每一个servelet起一个别名
    // login 就是一个serverlet
    private Map<String, String> servelet;
    // URL -> login
    private Map<String, String> mapping;

    public ServeletContext() {
        servelet = new HashMap<String, String>();
        mapping = new HashMap<String, String>();
    }

    public Map<String, String> getServelet() {
        return servelet;
    }

    public void setServelet(Map<String, String> servelet) {
        this.servelet = servelet;
    }

    public Map<String, String> getMapping() {
        return mapping;
    }

    public void setMapping(Map<String, String> mapping) {
        this.mapping = mapping;
    }

}
