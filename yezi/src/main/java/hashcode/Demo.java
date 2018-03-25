package hashcode;

import java.util.Objects;

public class Demo {
    public static void main(String[] args) {
        Demo demo = new Demo();
        System.out.println(demo.getClass());
        String a = "abXasJss";
        System.out.println(a.hashCode());
        System.out.println(Objects.hashCode(a));
    }

    public Demo() {
        System.out.println("__Start__");
    }
}
