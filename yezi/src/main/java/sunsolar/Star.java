package sunsolar;

import java.awt.Graphics;
import java.awt.Image;

import frame.GameUtil;

public class Star {
    public double x, y;
    private Image image;
    public int    width, height;

    public Star(Image image, double x, double y) {
        this(image);
        this.x = x;
        this.y = y;

    }

    public Star(String filePath, double x, double y) {
        this(GameUtil.getImage(filePath), x, y);
    }

    public Star(Image image) {
        this.image = image;
        this.width = image.getWidth(null);
        this.height = image.getHeight(null);
    }

    public void draw(Graphics g) {
        g.drawImage(image, (int) x, (int) y, null);
    }
}
