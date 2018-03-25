package iostream;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

public class ReadFile2 {

    public static void main(String[] args) throws IOException {
        //        InputStream is = new FileInputStream("/Users/yezi/Desktop/1.txt");
        //        int i = 0;
        //        is.skip(2);
        //        System.out.println(is.available());
        //        while ((i = is.read()) != -1) {
        //            System.out.println((char) i + " ");
        //        }
        //        byte[] b = new byte[10];
        //        is.read(b, 0, 2);
        //        is.close();
        //        System.out.println(b);
        OutputStream outputStream = new FileOutputStream(new File("test.txt"));
        // 写出数据
        outputStream.write("ABCD".getBytes());
        // 关闭IO流
        outputStream.close();

        // 内容追加写入
        OutputStream outputStream2 = new FileOutputStream("test.txt", true);
        // 输出换行符
        outputStream2.write("\r\n".getBytes());
        // 输出追加内容
        outputStream2.write("hello".getBytes());
        // 关闭IO流
        outputStream2.close();
    }
}
