package saxXml;

import java.util.ArrayList;
import java.util.List;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

/**
 * TODO 类实现描述 
 * @Company 杭州木瓜科技有限公司
 * @className: SaxDemo.java
 * @author Patrick Shen jingtian@amugua.com 
 * @date 2017年11月7日 下午3:34:03
 */
public class SaxDemo extends DefaultHandler {
    // 学生的数组
    private List<Student> students;
    // 学生个体
    private Student       student;
    // 标签
    private String        tagName;

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }

    // 调用一次
    @Override
    public void startDocument() throws SAXException {
        super.startDocument();
        System.out.println("--start--");
        students = new ArrayList<Student>();
    }

    @Override
    public void endDocument() throws SAXException {
        super.endDocument();
        System.out.println("--end--");
    }

    @Override
    public void startElement(String uri, String localName, String qName,
                             Attributes attributes) throws SAXException {
        super.startElement(uri, localName, qName, attributes);
        if (qName.equals("student")) {
            student = new Student();
            //获取student节点上的id属性值  
            student.setId(Integer.parseInt(attributes.getValue(0)));
            //获取student节点上的group属性值  
            student.setGroup(Integer.parseInt(attributes.getValue(1)));
        }
        this.tagName = qName;
    }

    @Override
    public void endElement(String uri, String localName, String qName) throws SAXException {
        super.endElement(uri, localName, qName);
        if (qName.equals("student")) {
            students.add(student);
        }
        this.tagName = null;
    }

    //调用多次  
    @Override
    public void characters(char[] ch, int start, int length) throws SAXException {
        super.characters(ch, start, length);
        if (this.tagName != null) {
            String data = new String(ch, start, length);
            if (this.tagName.equals("name")) {
                this.student.setName(data);
            } else if (this.tagName.equals("sex")) {
                this.student.setSex(data);
            } else if (this.tagName.equals("age")) {
                this.student.setAge(Integer.parseInt(data));
            } else if (this.tagName.equals("email")) {
                this.student.setEmail(data);
            } else if (this.tagName.equals("birthday")) {
                this.student.setBirthday(data);
            } else if (this.tagName.equals("memo")) {
                this.student.setMemo(data);
            }
        }
    }

}
