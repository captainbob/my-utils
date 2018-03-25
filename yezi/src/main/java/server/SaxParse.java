package server;

import java.util.ArrayList;
import java.util.List;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class SaxParse extends DefaultHandler {
    private List<ServeletMapping> list;
    private ServeletMapping       servelet;
    private String                tagName;

    public List<ServeletMapping> getList() {
        return list;
    }

    public void setList(List<ServeletMapping> list) {
        this.list = list;
    }

    @Override
    public void startDocument() throws SAXException {
        super.startDocument();
        list = new ArrayList<ServeletMapping>();
    }

    @Override
    public void endDocument() throws SAXException {
        super.endDocument();
    }

    @Override
    public void startElement(String uri, String localName, String qName,
                             Attributes attributes) throws SAXException {
        super.startElement(uri, localName, qName, attributes);
        if (qName.equals("servelet-item")) {
            servelet = new ServeletMapping();
        }
        tagName = qName;
    }

    @Override
    public void endElement(String uri, String localName, String qName) throws SAXException {
        super.endElement(uri, localName, qName);
        if (qName.equals("servelet-item")) {
            this.list.add(this.servelet);
        }
        this.tagName = null;

    }

    @Override
    public void characters(char[] ch, int start, int length) throws SAXException {
        super.characters(ch, start, length);
        if (this.tagName != null) {
            String data = new String(ch, start, length);
            switch (this.tagName) {
                case "url":
                    this.servelet.setUrl(data);
                    break;
                case "name":
                    this.servelet.setName(data);
                    break;
                default:
                    break;
            }
        }
    }

}
