package collection;

import java.util.ArrayList;
import java.util.Collection;

public class List {
    Collection<Person> es = new ArrayList<Person>();

    public static void main(String[] args) {
        YzArrayList ezArrayList = new YzArrayList(10);
        ezArrayList.add("111");
        ezArrayList.add("222");

        ezArrayList.add("222");
        System.out.println(ezArrayList.size());
        System.out.println(ezArrayList.get(2));
    }
}
