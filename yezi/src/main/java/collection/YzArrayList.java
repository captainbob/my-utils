package collection;

public class YzArrayList {
    private Object[] element;

    private int      size;

    public YzArrayList() {
        this(10);
    }

    public YzArrayList(int initialCapacity) {
        if (initialCapacity < 0) {
            try {
                throw new IllegalArgumentException("Illegal Capacity: " + initialCapacity);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        element = new Object[initialCapacity];

    }

    public YzArrayList(Object[] element) {
        this.element = element;
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public Object get(int index) {
        if (index < 0 || index >= size) {
            try {
                throw new IllegalArgumentException("jdjd");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return element[index];
    }

    public void add(Object obj) {
        // 扩容
        if (size >= element.length) {
            Object[] copy = new Object[size * 2];
            System.arraycopy(element, 0, copy, 0, element.length);
            this.element = copy;
        }
        this.element[size++] = obj;
    }

    public Object remove(int index) {
        Object oldValue = element[index];

        int numMoved = size - index - 1;
        if (numMoved > 0)
            System.arraycopy(element, index + 1, element, index, numMoved);
        element[--size] = null; // clear to let GC do its work

        return oldValue;
    }
}
