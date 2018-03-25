package server;

public class Register extends Servelet {

    @Override
    public void doGet(Request req, Response rep) throws Exception {
        rep.println("<html><head><title>注册</title><meta charset=UTF-8></head>");
        rep.println("<body><div><h1>");
        rep.println("欢迎").println(req.getParam("username")).println("回来");
        rep.println("</h1></div></body></html>");
    }

    @Override
    public void doPost(Request req, Response rep) throws Exception {
        rep.println("<html><head><title>注册</title><meta charset=UTF-8></head>");
        rep.println("<body><div><h1>");
        rep.println("欢迎").println(req.getParam("username")).println("回来");
        rep.println("</h1></div></body></html>");
    }

}
