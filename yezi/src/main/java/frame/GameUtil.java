package frame;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URL;

import javax.imageio.ImageIO;

/**
 * 
 * TODO 开发中常用的工具类
 * @Company 杭州木瓜科技有限公司
 * @className: GameUtil.java
 * @author Patrick Shen jingtian@amugua.com 
 * @date 2017年9月4日 下午11:18:36
 */
public class GameUtil {
    public static Image getImage(String path) {
        URL u = GameUtil.class.getClassLoader().getResource(path);
        BufferedImage image = null;
        try {
            image = ImageIO.read(u);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return image;
    }
}
