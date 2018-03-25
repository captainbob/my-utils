package iostream;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.Writer;

public class FileOperate {
    /**
     * 字节流写文件
     * @throws IOException
     */
    public static final String filePath = "/Users/yezi/Desktop/1.txt";

    public static void writeByteToFile() throws IOException {
        String hello = new String("hello world");
        byte[] byteArray = hello.getBytes();
        File file = new File(filePath);
        FileOutputStream os = new FileOutputStream(file);
        os.write(byteArray);
        os.close();
    }

    /**
     * 字节流读文件
     */
    public static void readByteFromFile() throws IOException {
        File file = new File(filePath);
        byte[] byteArray = new byte[(int) file.length()];
        FileInputStream is = new FileInputStream(file);
        int size = is.read(byteArray);
        System.out.println("大小：" + size + ";" + "内容：" + new String(byteArray) + ";");
        is.close();
    }

    /**
     * 字符流读文件
     * @throws IOException 
     */
    public static void readCharFromFile() throws IOException {
        File file = new File(filePath);
        Reader reader = new FileReader(file);
        char[] byteArray = new char[(int) file.length()];
        int size = reader.read(byteArray);
        System.out.println("大小：" + size + ";" + "内容：" + new String(byteArray) + ";");
        reader.close();
    }

    /**
     * 字符流写文件
     */
    public static void writeCharToFile() throws IOException {
        File file = new File(filePath);
        Writer writer = new FileWriter(file);
        String s = new String("run world");
        writer.write(s);
        writer.close();
    }

    /**
     * 字节流转换为字符流
     */
    public static void convertByteToChar() throws IOException {
        File file = new File(filePath);
        InputStream is = new FileInputStream(file);
        Reader reader = new InputStreamReader(is);
        char[] byteArray = new char[(int) file.length()];
        int size = reader.read(byteArray);
        System.out.println("大小：" + size + ";" + "内容：" + new String(byteArray) + ";");
        is.close();
        reader.close();
    }
    // 从上面可以看出io流可以嵌套
}
