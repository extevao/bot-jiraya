var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require("body-parser");
var request = require('request');
var router = express();
var server = http.createServer(router);
router.use(bodyParser.json());


var _estados = []


router.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == 'minhasenha123') {
        console.log('ok');
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.log('validação falhou');
        res.sendStatus(403);
    }
});

router.post('/webhook', function (req, res) {
    var data = req.body;
    console.log(JSON.stringify(data));

    if (data && data.object == 'page') {
        //percorrer todas as entradas entry
        data.entry.forEach(function (entry) {
            var pageId = entry.id;
            var timeOfEvent = entry.time;

            //percorre todas as mensagens

            entry.messaging.forEach(function (event) {
                if (event.message) {
                    // console.log(event.message)
                    trataMensagem(event);
                } else {
                    if (event.postback && event.postback.payload) {
                        switch (event.postback.payload) {

                            case 'clicou_comecar':
                                sendTextMessage(event.sender.id, 'Como posso te ajudar? Veja as opções disponíveis abaixo:');
                                sendFirstMenu(event.sender.id);

                                break;

                            case 'clicou_preco':
                                sendTextMessage(event.sender.id, 'Não sei o que fazer');
                                showOptionsMenu(event.sender.id);
                                break;

                            case 'clicou_novos_cursos':
                                sendTextMessage(event.sender.id, 'Só de exemplo, pega o menu ai novamente.');
                                showOptionsMenu(event.sender.id);
                                break;

                            case 'clicou_lista':
                                sendTextMessage(event.sender.id, 'Digite seu nome completo.');
                                _estados[event.sender.id] = 'entrada_nome';
                                break;

                            case 'respostas_rapidas':
                                sendTextMessage(event.sender.id, 'John Cena');
                                sendQuickReplies(event.sender.id);

                            default:
                            // code
                        }
                    }
                }
            });

        });

        res.sendStatus(200);
    }
});

router.post('/teste', function (req, res) {

    console.log(req.headers);
    console.log(req.body);


    res.send('ok');
})


function trataMensagem(event) {
    var senderId = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    // console.log('mensagem recebida do usuário', senderId, recipientID);

    var messageID = message.mid;
    var messageText = message.text;
    var attachments = message.attachments;

    if (messageText) {

        if (_estados[senderId]) {
            switch (_estados[senderId]) {
                case 'options_menu':

                    switch (messageText) {
                        case 'sim':
                            console.log('Tenho que enviar o menu para essa pessoa');
                            sendFirstMenu(senderId);
                            break;
                        case 'não':
                            sendTextMessage(senderId, 'Obrigado e tchau!');
                            break;

                        default:
                    }
                    break;

                case 'entrada_nome':
                    console.log('O nome do cliente é :', messageText);
                    sendTextMessage(senderId, messageText + ' o seu nome foi inserido na lista até mais!');
                    _estados[senderId] = null;
                    break;

                default:
                // code
            }

        } else {
            switch (messageText) {
                case 'oi':
                    sendTextMessage(senderId, 'Oi, tudo bem?');
                    break;
                case 'tchau':
                    sendTextMessage(senderId, 'Vaza');
                    break;
                default:

            }
        }


    } else if (attachments) {
        // tratamento dos anexos
        console.log('enviaram anexos');
    }

}

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };
    callSendAPI(messageData);
}

function sendFirstMenu(recipientId) {

    // var messageData = {
    //     recipient: {
    //         id: recipientId
    //     },
    //     message: {
    //         attachment: {
    //             type: 'template',
    //             payload: {
    //                 template_type: 'button',
    //                 text: 'O que você procura?',
    //                 buttons: [

    //                     {
    //                         type: 'postback',
    //                         title: 'Respostas rápidas',
    //                         payload: 'respostas_rapidas'
    //                     }, {
    //                         type: 'postback',
    //                         title: 'Cursos novos',
    //                         payload: 'clicou_novos_cursos'
    //                     }, {
    //                         type: 'postback',
    //                         title: 'Nome na lista',
    //                         payload: 'clicou_lista'
    //                     }
    //                 ]
    //             }
    //         }
    //     }
    // };
    var messageData = {
        "recipient": {
            "id": recipientId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Welcome to Peter's Hats",
                            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM9wN_I5flYj9w7EAhkNlMXsIiVk5lV7paEBowCfH0JTN_CcXf",
                            "subtitle": "We've got the right hat for everyone.",
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": "https://petersfancybrownhats.com",
                                    "title": "View Website"
                                }, {
                                    "type": "postback",
                                    "title": "Start Chatting",
                                    "payload": "DEVELOPER_DEFINED_PAYLOAD"
                                }
                            ]
                        },
                        {
                            "title": "Welcome to Peter's Hats",
                            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM9wN_I5flYj9w7EAhkNlMXsIiVk5lV7paEBowCfH0JTN_CcXf",
                            "subtitle": "We've got the right hat for everyone.",
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": "https://petersfancybrownhats.com",
                                    "title": "View Website"
                                }, {
                                    "type": "postback",
                                    "title": "Start Chatting",
                                    "payload": "DEVELOPER_DEFINED_PAYLOAD"
                                }
                            ]
                        }, {
                            "title": "Welcome to Peter's Hats",
                            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM9wN_I5flYj9w7EAhkNlMXsIiVk5lV7paEBowCfH0JTN_CcXf",
                            "subtitle": "We've got the right hat for everyone.",
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": "https://petersfancybrownhats.com",
                                    "title": "View Website"
                                }, {
                                    "type": "postback",
                                    "title": "Start Chatting",
                                    "payload": "DEVELOPER_DEFINED_PAYLOAD"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }

    callSendAPI(messageData);

}


function sendQuickReplies(recipientId) {

    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: 'Escolha uma opção.',
            quick_replies: [
                {
                    content_type: 'text',
                    title: 'Otimismo',
                    payload: 'um'
                }, {
                    content_type: 'text',
                    title: 'Resignação',
                    payload: 'dois'
                }, {
                    content_type: 'text',
                    title: 'Preocupação',
                    payload: 'tres'
                }, {
                    content_type: 'text',
                    title: 'Pessimismo',
                    payload: 'quatro'
                }, {
                    content_type: 'text',
                    title: 'Preocupação',
                    payload: 'cinco'
                }

            ]
        }
    };
    callSendAPI(messageData);

}

function showOptionsMenu(recipientId) {

    setTimeout(function () {

        sendTextMessage(recipientId, 'Posso te ajudar com mais alguma coisa?');
        _estados[recipientId] = 'options_menu';


    }, 2500);

}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.10/me/messages',
        qs: {
            access_token: 'EAAaFvKRGKhYBAKHfbCamCKS6l8C8MDR29Lb1UBlh1vgjB8AHQjiBQaYOyuxFtBUhQ5CsT8lL8UrxqpNP3PJCZBJ6aAIajChoXStYbvZBSE1p5ef8QOKjQ3we8CeVKlb6O3cbGoUf8HZB2Y9pV2ysA2N3JSel8LmUcn6t2nZAgwZDZD'
        },
        method: 'POST',
        json: messageData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            //console.log('mensagem enviada com sucesso');
            // console.log(body);

            var recipientId = body.recipient_id;
            var messageId = body.message_id;


        } else {
            console.log('erro: ', error);
        }
    });
}






server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Chat server listening at", addr.address + ":" + addr.port);
});
