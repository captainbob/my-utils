package com.gameFrame;

import java.awt.Graphics;
import java.awt.Image;

import frame.GameUtil;
import frame.MyFrame;

public class GameFrame extends MyFrame {

    Image           image = GameUtil.getImage("images/add_fav.png");

    private double  x, y = 50;
    private boolean left  = true;

    @Override
    public void paint(Graphics g) {
        g.drawLine(100, 100, 200, 200);
        g.drawRect(100, 100, 200, 200);
        g.drawOval(100, 100, 200, 200);
        g.drawString("我是先", 200, 200);
        g.drawImage(image, (int) x, (int) y, null);
        if (left) {
            x += 3;
        } else {
            x -= 3;
        }
        if (x > 200 - 30) {
            left = false;
        }
        if (x < 3) {
            left = true;
        }
    }

    public static void main(String[] args) {
        GameFrame gf = new GameFrame();
        gf.launchFrame();
    }
}
