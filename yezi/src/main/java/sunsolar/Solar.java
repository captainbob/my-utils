package sunsolar;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Image;

import frame.Constants;
import frame.GameUtil;
import frame.MyFrame;;

public class Solar extends MyFrame {

    Image  bg      = GameUtil.getImage("images/bg.jpg");                                   // 背景图片  
    Star   Sun     = new Star("images/sun.jpg", Constants.WIDTH / 2, Constants.HEIGHT / 2);

    Planet mercury = new Planet(Sun, "images/Mercury.jpg", 110, 50, 0.3);                  // 水星  
    Planet venus   = new Planet(Sun, "images/Venus.jpg", 150, 90, 0.4);                    // 金星  
    Planet earth   = new Planet(Sun, "images/earth.jpg", 190, 130, 0.1);                   // 地球  
    Planet mars    = new Planet(Sun, "images/Mars.jpg", 230, 170, 0.3);                    // 火星  
    Planet jupiter = new Planet(Sun, "images/Jupiter.jpg", 270, 210, 0.4);                 // 木星  
    Planet saturn  = new Planet(Sun, "images/Saturn.jpg", 310, 250, 0.3);                  // 土星  
    Planet uranus  = new Planet(Sun, "images/Uranus.jpg", 340, 290, 0.2);                  // 天王星  
    Planet neptune = new Planet(Sun, "images/Neptune.jpg", 380, 330, 0.1);                 // 海王星  
    Planet moon    = new Planet(earth, "images/moon.jpg", 30, 20, 0.2, true);              // 月球 

    @Override
    public void paint(Graphics g) {
        g.drawImage(bg, 0, 0, null);

        Color c = g.getColor();
        g.drawImage(bg, 0, 0, null);
        Sun.draw(g);
        mercury.draw(g);
        venus.draw(g);
        earth.draw(g);
        mars.draw(g);
        jupiter.draw(g);
        saturn.draw(g);
        uranus.draw(g);
        neptune.draw(g);
        moon.draw(g);
        this.setVisible(true);
        g.setColor(c);

    }

    public static void main(String[] args) {
        Solar solar = new Solar();
        solar.launchFrame();
    }
}
