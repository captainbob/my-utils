package com.gameFrame;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Image;

import frame.GameUtil;
import frame.MyFrame;

public class GameFrame02 extends MyFrame {
    Image          image  = GameUtil.getImage("images/add_fav.png");

    private double x, y;
    private double degree = 3.14 / 3;

    @Override
    public void paint(Graphics g) {
        g.drawImage(image, (int) x, (int) y, null);
        double ovalX = image.getWidth(null);
        double ovalY = image.getHeight(null);
        Color aColor = g.getColor();
        g.setColor(Color.RED);
        g.drawOval((int) (0 + ovalX / 2), (int) (150 + ovalY / 2), 200, 100);
        g.setColor(aColor);
        x = 100 + 100 * Math.cos(degree);
        y = 200 + 50 * Math.sin(degree);
        degree += 0.1;
    }

    public static void main(String[] args) {
        GameFrame02 gfFrame02 = new GameFrame02();
        gfFrame02.launchFrame();
    }

}
