package sunsolar;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Image;

import frame.GameUtil;

public class Planet extends Star {
    private double longAxis;
    private double shortAxis;
    private double degree;
    private double speed;
    // 围绕哪个星球运动
    Star           center;
    // 是否是行星，true为不是行星
    boolean        satellite;

    public Planet(Image image, double x, double y) {
        super(image, x, y);
    }

    public Planet(Star center, String imagePath, double longAxis, double shortAxis, double speed) {
        super(GameUtil.getImage(imagePath));
        this.center = center;
        this.longAxis = longAxis;
        this.shortAxis = shortAxis;

        this.speed = speed;
        this.x = center.x + longAxis;
        this.y = center.y;

    }

    public Planet(Star center, String imagePath, double longAxis, double shortAxis, double speed,
                  boolean satellite) {
        // TODO Auto-generated constructor stub

        this(center, imagePath, longAxis, shortAxis, speed);
        this.satellite = satellite;
    }

    public void draw(Graphics g) {
        super.draw(g);
        if (!satellite) {
            drawOval(g);
        }

        startmove();
    }

    public void drawOval(Graphics g) {
        double ovalX, ovalY, ovalW, overH;
        ovalX = center.x + center.width / 2 - longAxis;
        ovalY = center.y + center.height / 2 - shortAxis;
        ovalW = 2 * longAxis;
        overH = 2 * shortAxis;

        Color color = g.getColor();
        g.setColor(Color.BLUE);
        g.drawOval((int) ovalX, (int) ovalY, (int) ovalW, (int) overH);
        g.setColor(color);
    }

    public void startmove() {
        x = center.x + width / 2 + longAxis * Math.cos(degree);
        y = center.y + height / 2 + shortAxis * Math.sin(degree);
        degree += speed;

    }
}
