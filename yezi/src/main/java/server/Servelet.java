package server;

public abstract class Servelet {
    // 初始化方法

    public void server(Request req, Response rep) throws Exception {
        if (req.method.equals("POST")) {
            doPost(req, rep);
        }
        if (req.method.equals("GET")) {
            doGet(req, rep);
        }
    }

    // 处理get方法
    public abstract void doGet(Request req, Response rep) throws Exception;

    // 处理post方法
    public abstract void doPost(Request req, Response rep) throws Exception;
}
