package server;

public class LoginServer extends Servelet {

    public LoginServer() {
    }

    @Override
    public void doGet(Request req, Response rep) {
        String message;
        if (req.getParam("username").equals("yezi") && req.getParam("password").equals("11")) {
            message = "欢迎你，椰子";
        } else {
            message = "用户名或密码错误";
        }
        rep.println("<html><head><title>椰子demo</title><meta charset=UTF-8></head>");
        rep.println("<body><div><h1>" + message + "</h1></div></body></html>");
    }

    @Override
    public void doPost(Request req, Response rep) {
        String message;
        if (req.getParam("username").equals("yezi") && req.getParam("password").equals("11")) {
            message = "欢迎你，椰子";
        } else {
            message = "用户名或密码错误";
        }
        rep.println("<html><head><title>椰子demo</title><meta charset=UTF-8></head>");
        rep.println("<body><div><h1>" + message + "</h1></div></body></html>");
    }

}
