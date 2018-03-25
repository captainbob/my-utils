package saxXml;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.SAXException;

public class Test {

    public static void main(String[] args) throws ParserConfigurationException, SAXException,
                                           IOException {

        SAXParser parser = null;
        parser = SAXParserFactory.newInstance().newSAXParser();
        SaxDemo parseXml = new SaxDemo();
        //加载资源文件 转化为一个输入流  
        InputStream stream = SaxDemo.class.getClassLoader().getResourceAsStream("student.xml");
        //调用parse()方法  
        parser.parse(stream, parseXml);
        //遍历结果  
        List<Student> list = parseXml.getStudents();
        for (Student student : list) {
            System.out.println("id:" + student.getId() + "\tgroup:" + student.getGroup() + "\tname:"
                               + student.getName() + "\tsex:" + student.getSex() + "\tage:"
                               + student.getAge() + "\temail:" + student.getEmail() + "\tbirthday:"
                               + student.getBirthday() + "\tmemo:" + student.getMemo());
        }
    }

}
