package frame;

import java.awt.Frame;
import java.awt.Image;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

public class MyFrame extends Frame {
    Image image = GameUtil.getImage("images/add_fav.png");

    public void launchFrame() {
        setSize(Constants.WIDTH, Constants.HEIGHT);
        setLocation(100, 100);
        setVisible(true);

        new PaintThread().start(); // 启动重画线程
        addWindowListener(new WindowAdapter() {

            @Override
            public void windowClosing(WindowEvent e) {
                System.exit(0);
            }

        });
    }

    /**
     * 
     * 定义一个重画类 
     * @Company 杭州木瓜科技有限公司
     * @className: MyFrame.java
     * @author Patrick Shen jingtian@amugua.com 
     * @date 2017年9月4日 下午11:36:17
     */
    class PaintThread extends Thread {
        @Override
        public void run() {
            while (true) {
                repaint();
                try {
                    Thread.sleep(40);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public static void main(String[] args) {
        MyFrame gf = new MyFrame();
        gf.launchFrame();
    }
}
