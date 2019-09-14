from sanic import Sanic, response
import socketio

namespace = '/danmaku'

online = 0


def main():
    app = Sanic()
    sio = socketio.AsyncServer(async_mode='sanic')
    sio.attach(app)

    @app.get('/')
    async def index(req):
        return await response.file('./index.html')

    @sio.on('connect', namespace=namespace)
    async def connect(sid, environ):
        # print(sid,'连接到socketio')
        global online
        online += 1
        await sio.emit('online', str(online), namespace=namespace)

    @sio.on('disconnect', namespace=namespace)
    async def disconnect(sid):
        global online
        online -= 1
        await sio.emit('online', str(online), namespace=namespace)

    @sio.on('send_danmaku', namespace=namespace)
    async def send_danmaku(sid, message):

        # 删除弹幕的边框颜色
        del message['borderColor']

        print('发送弹幕', message)
        # 广播给其他人
        await sio.emit('get_danmaku', message, namespace=namespace, skip_sid=sid)

    app.run(host='0.0.0.0', port=8080, )


if __name__ == '__main__':
    main()
