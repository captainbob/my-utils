package server;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

public class Request {
    // 请求方式
    public String                    method;
    // 请求资源
    public String                    url;

    // 请求参数
    public Map<String, List<String>> parameterMapValues;

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    //内部
    public static final String CRLF = "\r\n";
    private InputStream        is;
    private String             requestInfo;

    public Request() {
        method = "";
        url = "";
        parameterMapValues = new HashMap<String, List<String>>();
        requestInfo = "";
    }

    public Request(InputStream is) {
        this();
        this.is = is;
        try {
            byte[] data = new byte[2048];
            int len = is.read(data);
            requestInfo = new String(data, 0, len);
        } catch (IOException e) {
            return;
        }
        // 分析头信息
        parseRequestInfo();
    }

    public void parseRequestInfo() {
        if (null == requestInfo || (requestInfo = requestInfo.trim()).equals("")) {
            return;
        }
        String paramString = "";
        String firstLine = requestInfo.substring(0, requestInfo.indexOf(CRLF));
        int idx = firstLine.indexOf("/");
        this.method = firstLine.substring(0, idx).trim();
        String urlStr = firstLine.substring(idx, firstLine.indexOf("HTTP/")).trim();
        /**
         * 解析url的内容
         */
        if (this.method.equals("POST")) {
            this.url = removeUrlHtml(urlStr);
            paramString = requestInfo.substring(requestInfo.lastIndexOf(CRLF)).trim();

        } else if (this.method.equals("GET")) {
            if (urlStr.contains("?")) {
                String[] urlArray = urlStr.split("\\?");
                this.url = removeUrlHtml(urlArray[0]);
                paramString = urlArray[1];

            } else {
                this.url = removeUrlHtml(urlStr);
                ;
            }
        }
        /**
         * 请请求分装到Map中
         */
        // 当没有参数时
        if (paramString.equals("")) {
            return;
        }
        // 有参数时
        parseParams(paramString);
    }

    public void parseParams(String params) {
        StringTokenizer tokens = new StringTokenizer(params, "&");
        while (tokens.hasMoreTokens()) {
            String token = tokens.nextToken();

            String[] keyValues = token.split("=");
            if (keyValues.length == 1) {
                keyValues = Arrays.copyOf(keyValues, 2);
                keyValues[1] = null;
            }

            String key = keyValues[0].trim();
            String value = keyValues[1] == null ? null : keyValues[1].trim();

            parameterMapValues.put(key, new ArrayList<String>());

            List<String> values = parameterMapValues.get(key);
            values.add(value);

        }
    }

    public String[] getParamsString(String name) {
        List<String> values = null;
        if ((values = parameterMapValues.get(name)) == null) {
            return null;
        } else {
            return values.toArray(new String[0]);
        }
    }

    public String getParam(String name) {
        String[] values = this.getParamsString(name);
        if (values == null) {
            return null;
        } else {
            return values[0];
        }
    }

    // 去掉url后的.html
    public String removeUrlHtml(String url) {
        int idx = url.indexOf(".html");
        if (idx > -1) {
            String aString = url.substring(0, idx);
            return aString;
        } else {
            return url;
        }
    }
}
