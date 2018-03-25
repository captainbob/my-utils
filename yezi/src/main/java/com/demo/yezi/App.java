package com.demo.yezi;

/**
 * Hello world!
 *
 */
public class App {

    public static int getAccNum(int n) {
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        return sum;
    }

    public static int getJAccNum(int n) {
        int sum = 1;
        for (int i = 1; i <= n; i++) {
            sum *= i;
        }
        return sum;
    }

    public static void main(String[] args) {
        for (int i = 1; i <= 9; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.printf("%d*%d=%d;", j, i, i * j);
            }
            System.out.println("\r\n");
        }
        int sum = 0;
        for (int k = 0; k <= 100; k++) {
            sum += getAccNum(k);
        }
        System.out.println(sum);
        double sum2 = 0;
        for (int k = 0; k <= 10; k++) {
            sum2 += getJAccNum(k);
        }
        System.out.println(sum2);

        System.out.println("Hello World!");
    }
}
