package iostream;

import java.io.FileWriter;
import java.io.IOException;

public class ReadFile {
    public static void main(String[] args) throws IOException {
        FileWriter fw = new FileWriter("/Users/yezi/Desktop/1.txt");
        fw.write("hello world122");
        fw.flush();
        fw.write("first_test");
        fw.close();

    }
}
