package server;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.SAXException;

@SuppressWarnings("rawtypes")
public class WebApp {

    private static ServeletContext context;

    static {
        context = new ServeletContext();
        Map<String, String> mapping = context.getMapping();

        mapping.put("/login", "login");
        mapping.put("/log", "login");
        mapping.put("/reg", "register");
        mapping.put("/index", "index");

        Map<String, String> servelet = context.getServelet();
        SAXParser parser = null;
        try {
            parser = SAXParserFactory.newInstance().newSAXParser();
        } catch (ParserConfigurationException | SAXException e) {
            e.printStackTrace();
        }
        SaxParse parseXml = new SaxParse();
        //加载资源文件 转化为一个输入流  
        InputStream stream = SaxParse.class.getClassLoader().getResourceAsStream("server.xml");
        //调用parse()方法  
        try {
            parser.parse(stream, parseXml);
        } catch (SAXException | IOException e) {
            e.printStackTrace();
        }
        //遍历结果  
        List<ServeletMapping> list = parseXml.getList();
        for (ServeletMapping serverItem : list) {
            servelet.put(serverItem.getUrl(), serverItem.getName());
        }
        //        servelet.put("login", "server.LoginServer");
        //        servelet.put("register", "server.Register");
        //        servelet.put("index", "server.IndexServer");
    }

    public static Servelet getServelet(String url) throws InstantiationException,
                                                   IllegalAccessException, ClassNotFoundException {
        if (null == url || (url = url.trim()).equals("")) {
            return null;
        }
        String name = context.getServelet().get(context.getMapping().get(url));
        return (Servelet) Class.forName(name).newInstance();
        //        return context.getServelet().get(context.getMapping().get(url));
    }
}
