 const petAnimeIndex = [
        null,
        {name:"Aka",
        actions:{
            stand:{src:'./img/pet/stand.png',json:'./img/pet/stand.json',speed:200},
            eat:{src:"./img/pet/eat.png",json:"./img/pet/eat.json",speed:100},
            wait:{src:"./img/pet/wait.png",json:"./img/pet/wait.json",speed:100},
            sword:{src:"./img/pet/sword.png",json:"./img/pet/sword.json",speed:60}
                }
        },
        {name:"Shiro",
        actions:{
            stand:{src:'./img/pet/stand2.png',json:'./img/pet/stand2.json',speed:100},
            eat:{src:"./img/pet/eat2.png",json:"./img/pet/eat2.json",speed:100},
            wait:{src:"./img/pet/wait2.png",json:"./img/pet/wait2.json",speed:100},
            sword:{src:"./img/pet/sword2.png",json:"./img/pet/sword2.json",speed:30}
                }
        },  
    ]
    const replyWordIndex = [null,
        [
        '有什么事喵？',
        '要去冒险吗？',
        '别摸耳朵喵！',
        '要喂我鱼干吗？',
        '王牌级喵险家参上喵',
        '呃呃喵'],
        ['说话...浪费能量',
        '充电中...',
        '蛋糕...能量源',
        '电压检测中...',
        '节能模式',
        'Shiro是...自动歼灭AI-Z07'
        ]
        ]
    const  waitWordIndex = [
        null,
        '天气不错喵',
        '待机中...'
    ]
    const feedRelyTextIndex=[null,
            [
             '虽然不多，但是谢谢了喵',
             '谢谢喵，看来今天可以吃饱了',
             '哦呀，没想到你还挺大方的喵',
             '难得的丰盛喵，你今天赛跑猜中了？',
             '今天的任务很困难吗？。。',
             '你你你，挑战领主的任务我可不去哦？！'
            ],
             [
             '电量增加检测...两节电池',
             '电量增加检测...标准蓄电池',
             '电量已满',
             '进入高性能模式',
             '能力增幅200%',
             '过载...语言系统可能混乱，诶嘿嘿'
             ]

         ]
    //战斗用
    const playerBattleIndex = [
        null,
        {name:'Aka',life:100,speed:10,attack:50,heal:60,
        skill1:'攻击',skillkey1:'attack',skill2:'治愈',skillkey2:'heal',skill3:'吸血',skillkey3:'vampire'},
        {name:'Shiro',life:70,speed:13,attack:80,heal:50,
        skill1:'电击',skillkey1:'attack',skill2:'修理',skillkey2:'heal',skill3:'拷贝',skillkey3:'vampire'},   
    ]
     const enemyAnimeIndex = [
        null,
        {name:"enemy1",
        actions:{
            stand:{src:'./img/pet/enemy1.png',json:'./img/pet/enemy1.json',speed:200},
                }
        }   
    ]
    const enemyBattleIndex = [
        null,
        {name:1,life:200,speed:10,attack:20,heal:30}
        ]