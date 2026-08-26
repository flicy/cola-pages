/* 五月天唱片 · 城市唱片版 v2
   流程：抽生活片段（城市×时间×人物×感官×情绪）→ 连去五月天的歌（语义匹配，可换可改）
   → 引擎用原创词库按气口拼贴出主歌/副歌/桥段 → 分段编曲 → 刻成一张城市唱片。
   语义曲库只含歌名与情绪/意象元数据，不含任何歌词原文与原始音源；歌词草稿全部由引擎原创生成。 */

/* ===== 1. 语义曲库：歌名 + 主题走向 + 叙事视角 + 意象标签 + 段落气质（无任何歌词原文） ===== */
const STYLE_META={pop:{label:'青春流行',bpm:96,root:293.66},dance:{label:'全场跳动',bpm:124,root:164.81},rnb:{label:'深夜 R&B',bpm:88,root:220},citypop:{label:'午后轻快',bpm:108,root:246.94},synth:{label:'电子星河',bpm:84,root:196},indie:{label:'独立真心',bpm:102,root:130.81},funk:{label:'热血摇滚',bpm:112,root:246.94},ballad:{label:'深夜慢歌',bpm:72,root:146.83}};
const S=(id,name,theme,pov,tags,frag,style,moods,arc)=>({id,name,theme,pov,tags,frag,style,moods,arc});
const MAYDAY_LIB=[
S('s1','《倔强》','被否定之后偏不认输的倔起','第一人称对世界喊话',['夜路','握拳','逆风','天台','汗水'],['主歌-压着唱','副歌-全员呐喊'],'funk',['热血','迷茫'],'还是把拳头攥紧了'),
S('s2','《疯狂世界》','对拥挤成人世界的疲惫发问','旁观者视角的质问',['地铁','人潮','灰色','叹息','雨'],['主歌-絮语','副歌-失重'],'dance',['迷茫','孤独'],'决定先把自己捞起来'),
S('s3','《知足》','爱到尽头心甘情愿的放手','第一人称告白',['笑容','月光','放手','夏天'],['主歌-轻声','副歌-释然'],'citypop',['遗憾','治愈'],'学会了笑着成全'),
S('s4','《恋爱ing》','热恋时心跳抢拍的速度感','恋爱中人的直白记录',['心跳','街头','晴天','奔跑'],['全曲-跳动'],'citypop',['狂欢','治愈'],'把甜写进了每一拍'),
S('s5','《离开地球表面》','甩开地心引力的周末狂欢','全场大合唱视角',['跳跃','音浪','周末','汗水'],['前奏-起飞','副歌-跳针'],'dance',['狂欢'],'把自己弹离了地面'),
S('s6','《憨人》','笨拙却死心眼的坚持','自嘲式独白',['路灯','汗水','坚持','深夜'],['主歌-低回','副歌-憨直'],'indie',['热血','孤独'],'承认自己是憨人也要做完'),
S('s7','《突然好想你》','深夜毫无防备的想念突袭','深夜独白',['旧照片','深夜','雨','遗憾'],['主歌-钢琴','副歌-决堤'],'ballad',['想念','遗憾'],'让想念在深夜过了一遍'),
S('s8','《人生海海》','起落都看开的豁达','过来人拍肩',['海','风','起伏'],['副歌-开阔'],'pop',['治愈','迷茫'],'把烦恼泡进了海里'),
S('g1','《温柔》','放手成全的克制温柔','转身前的告白',['月光','背影','成全'],['主歌-克制','副歌-温柔爆发'],'ballad',['遗憾','陪伴'],'把喜欢换成了成全'),
S('g2','《干杯》','散伙饭上的青春致意','老友对坐',['教室','夏天','啤酒','老友','毕业'],['主歌-叙事','副歌-大合唱'],'pop',['陪伴','遗憾'],'把那一年敬了一遍'),
S('g3','《星空》','遗憾之后仰望的和解','夜空下的独白',['星空','彩虹','眼泪','约定'],['主歌-铺底','副歌-辽阔'],'synth',['治愈','遗憾'],'在星空下和遗憾和解'),
S('g4','《拥抱》','深夜里诚实的依偎与孤独','凌晨的自语',['夜色','月光','孤独','拥抱'],['全曲-氤氲'],'rnb',['孤独','治愈'],'把自己轻轻抱住了'),
S('g5','《任意门》','在城市与记忆间任意穿行','巡游视角',['城市','车站','时光','门'],['主歌-穿行','副歌-抵达'],'dance',['陪伴','热血'],'推开了那扇任意的门'),
S('h1','《顽固》','被生活磨损仍不撒手的执拗','中年自白',['办公室','梦想','白发','坚持'],['主歌-叙事','副歌-自证'],'funk',['热血','迷茫'],'顽固地又试了一次'),
S('h2','《后来的我们》','重逢时才说得出口的错位','旧人重逢',['机场','旧城','重逢','遗憾'],['主歌-寒暄','副歌-错位'],'ballad',['遗憾','想念'],'把没说的留在了原地'),
S('h3','《如果我们不曾相遇》','对相遇本身的感激','假设句式',['平行','相遇','命运'],['主歌-假设','副歌-感谢'],'indie',['陪伴','治愈'],'庆幸故事没有如果'),
S('h4','《派对动物》','把烦恼锁在门外的夜场狂欢','夜店人群',['霓虹','低音','舞池'],['前奏-低音','副歌-狂欢'],'dance',['狂欢'],'痛快地当了一晚派对动物'),
S('h5','《你不是真正的快乐》','笑容背后的疲惫与自救','镜子前的对视',['面具','笑容','人群','伤口'],['主歌-拆穿','副歌-松绑'],'rnb',['孤独','治愈'],'允许自己不那么快乐'),
S('h6','《我不愿让你一个人》','分手后放不下的牵挂','欲言又止的牵挂',['雨','伞','街角','牵挂'],['主歌-叮咛','副歌-牵挂'],'ballad',['想念','遗憾'],'还是说了到家说一声'),
S('h7','《步步》','不着急的陪伴与选择','同行者视角',['路口','脚印','陪伴'],['主歌-平稳','副歌-笃定'],'pop',['陪伴','治愈'],'一步一步走到了这里'),
S('h8','《转眼》','回望来路时的恍神与释然','时间回望',['时间','照片','白发','释然'],['主歌-恍神','副歌-释然'],'ballad',['遗憾','治愈'],'转眼之间都值得'),
S('h9','《成名在望》','没人鼓掌仍在排练的孤勇','排练室自白',['排练室','泡面','灯光','梦想'],['主歌-自嘲','副歌-点火'],'pop',['热血','孤独'],'作品正在慢慢长大'),
S('h10','《伤心的人别听慢歌》','用快歌把难过撕开的自救','劝人视角',['节奏','音量','痊愈'],['前奏-鼓点','副歌-撕开'],'funk',['治愈','热血'],'把音量调大了两格'),
S('h11','《入阵曲》','集结号响时的并肩','阵中视角',['战鼓','旗帜','人群','呐喊'],['全曲-行进'],'dance',['热血','陪伴'],'把自己排进了阵型'),
S('h12','《笑忘歌》','青春散场也要笑着告别','散场后的回望',['单车','夏天','毕业','笑'],['主歌-明亮','副歌-笑着哭'],'pop',['陪伴','遗憾'],'把散场笑成了纪念'),
S('h13','《有些事现在不做一辈子都不会做了》','清单上的事终于出发','自我催促',['清单','出发','冲动','车票'],['主歌-念叨','副歌-出发'],'indie',['热血','迷茫'],'把「改天」变成了「今天」'),
S('h14','《第二人生》','重启自己的假设与勇气','分岔路口',['重启','清晨','勇气','分岔'],['主歌-假设','副歌-重启'],'pop',['热血','治愈'],'给自己开了一局新的'),
S('h15','《诺亚方舟》','末日前夜的最后拥抱','末日告别',['洪水','船票','末日','拥抱'],['主歌-倒计时','副歌-告别'],'synth',['遗憾','陪伴'],'把今天过得像样'),
S('h16','《志明与春娇》','平凡恋人的聚散与遗憾','街头叙事',['车站','雨','恋人','离别'],['主歌-叙事','副歌-合唱'],'indie',['遗憾','想念'],'把老歌唱完了全场'),
S('h17','《时光机》','想修好过去的每件小事','回忆修理员',['旧物','童年','抽屉','回忆'],['主歌-翻找','副歌-返程'],'citypop',['想念','治愈'],'回去看了一眼又回来'),
S('h18','《将军令》','鼓点响起时的全员集结','擂台视角',['鼓点','号角','热血','对决'],['前奏-点将','副歌-擂鼓'],'funk',['热血','狂欢'],'今天特别能打')
];
const songOf=id=>MAYDAY_LIB.find(s=>s.id===id);

/* ===== 2. 生活片段引擎：62 个场景核 × 城市 × 时间词 ===== */
const CITIES=['北京','上海','广州','深圳','杭州','成都','重庆','西安','武汉','南京','长沙','台北'];
const TIMES={morning:['清晨六点半','早高峰的八点','上班路上','刚醒来的第七分钟'],midday:['中午十二点','午休的间隙','午饭后的十分钟'],afternoon:['下午三点','傍晚前的最后一小时','下午茶时间','日落前'],evening:['晚上八点','下班路上','晚饭过后','华灯初上'],night:['凌晨十二点','深夜两点半','睡前','午夜的城市上空']};
const TIME_NOUN={morning:'清晨',midday:'正午',afternoon:'午后',evening:'入夜',night:'深夜'};
/* 场景核：{歌, 时段, 场景正文(人物+感官细节), 情绪, 意象} —— 全部为原创场景写作 */
const SEEDS=[
{s:'s1',t:['morning'],c:'闹钟响到第三遍，你顶着一夜没睡的哑嗓子起床，把今天又扛在了肩上。',m:'热血',i:['夜路','握拳']},
{s:'s1',t:['night'],c:'方案第七次被打回，你在工位把笔帽咬出了牙印，改完最后一行才关灯。',m:'热血',i:['汗水','坚持']},
{s:'s2',t:['morning'],c:'早高峰的车厢把你挤成一枚书签，你和一整车沉默的人一起被运往市中心。',m:'迷茫',i:['地铁','人潮']},
{s:'s2',t:['evening'],c:'写字楼下人潮漫过斑马线，你被推着走，忽然忘了自己要去哪。',m:'孤独',i:['人潮','灰色']},
{s:'s3',t:['midday','afternoon'],c:'外卖比预计早到了十分钟，汤还是烫的，你决定今天到这里就很好。',m:'治愈',i:['笑容','夏天']},
{s:'s3',t:['afternoon'],c:'窗边的云刚好排成一条直线，你放下手里的事，看了很久。',m:'治愈',i:['天空','释然']},
{s:'s4',t:['all'],c:'手机震了一下，是那个人发来的「下楼」，你的心跳先一步冲出了门。',m:'狂欢',i:['心跳','奔跑']},
{s:'s4',t:['afternoon'],c:'并排走的两双鞋踩着同一个节奏，红绿灯变了几轮，你都舍不得走完。',m:'治愈',i:['街头','心跳']},
{s:'s5',t:['evening'],c:'打卡成功的下一秒，你把工牌塞进包里，整个人从座位上弹了起来。',m:'狂欢',i:['跳跃','周末']},
{s:'s5',t:['night'],c:'副歌一响全场跳起来，你也跟着离地，落下来的时候还在笑。',m:'狂欢',i:['音浪','汗水']},
{s:'s6',t:['night'],c:'整层楼只剩你一盏灯，你在跟一件没人看见的事死磕，还不想认输。',m:'热血',i:['深夜','坚持']},
{s:'s6',t:['morning'],c:'所有人都说这条路绕远了，你还是背起包出了门，走得很慢但没有停。',m:'热血',i:['逆风','坚持']},
{s:'s7',t:['night'],c:'深夜刷到一张旧合照，你愣了很久，手指在屏幕上停成了暂停键。',m:'想念',i:['旧照片','深夜']},
{s:'s7',t:['night'],c:'雨点敲着窗，一首老歌的前奏毫无预兆地响起来，你想起了同一座城市里的某人。',m:'想念',i:['雨','深夜']},
{s:'s8',t:['afternoon'],c:'搞砸的事在下午忽然显得没那么大，你把烦恼写下来又划掉，去接了杯热水。',m:'治愈',i:['起伏','释然']},
{s:'s8',t:['morning'],c:'出门时风把阴天吹开了一道口子，你决定今天的糟心事就到昨天为止。',m:'治愈',i:['风','天空']},
{s:'g1',t:['evening'],c:'话到嘴边你又咽了回去，把「别走」换成了「路上小心」。',m:'遗憾',i:['背影','成全']},
{s:'g1',t:['night'],c:'你删掉了打好的一段长文，只发了一个「晚安」，然后把手机扣在桌上。',m:'遗憾',i:['月光','成全']},
{s:'g2',t:['evening'],c:'老友聚会最后一杯，杯子碰在一起，有人把十年的事讲成了三句话。',m:'陪伴',i:['老友','夏天']},
{s:'g2',t:['night'],c:'散场前的合唱没有人指挥，但每个人都会唱，你把这一晚记进了备忘录。',m:'陪伴',i:['毕业','老友']},
{s:'g3',t:['night'],c:'天台的风把云吹开，你抬头的那一秒，星星刚好出来透了口气。',m:'治愈',i:['星空','夜色']},
{s:'g3',t:['night'],c:'你把没实现的那个约定在心里讲了一遍，替它找了一颗最亮的星。',m:'遗憾',i:['约定','星空']},
{s:'g4',t:['night'],c:'凌晨的房间里只剩呼吸和空调声，你把自己连人带被子裹紧了一点。',m:'孤独',i:['夜色','拥抱']},
{s:'g4',t:['night'],c:'耳机里循环到最慢的那一首，你在黑暗里睁着眼，跟自己和好了十分钟。',m:'治愈',i:['月光','孤独']},
{s:'g5',t:['all'],c:'你从城市这头穿到那头，出站的风一吹，像推开了一扇新的门。',m:'陪伴',i:['车站','城市']},
{s:'g5',t:['afternoon'],c:'换乘通道里人潮往两边分，你逆着走了一段，像抄了近路穿过这座城。',m:'热血',i:['城市','时光']},
{s:'h1',t:['morning'],c:'所有人都说不划算，你还是把那件没人安排的事排进了今天的清单。',m:'热血',i:['办公室','梦想']},
{s:'h1',t:['night'],c:'日历翻到今天，你为那个说了很多年的目标，又存进了一小步进度。',m:'热血',i:['坚持','梦想']},
{s:'h2',t:['evening'],c:'老同学的消息停在「在吗」，你对着输入框打了一段又删掉。',m:'遗憾',i:['重逢','遗憾']},
{s:'h2',t:['night'],c:'你路过曾经一起等车的站台，站牌换新的了，等车的人换了一茬。',m:'想念',i:['车站','旧城']},
{s:'h3',t:['all'],c:'今天遇到的人帮你把卡住的事理顺了，你想说一句幸好，最后说了谢谢。',m:'陪伴',i:['相遇','命运']},
{s:'h3',t:['afternoon'],c:'你忽然想到，如果那天没去那个场合，现在的一切都不会发生。',m:'治愈',i:['平行','相遇']},
{s:'h4',t:['night'],c:'音乐一响，你就把这一周锁在了门外，低音从脚底往上爬。',m:'狂欢',i:['低音','舞池']},
{s:'h4',t:['night'],c:'舞池里的灯扫过来扫过去，你跟陌生人碰了一下手肘，笑得很省力。',m:'狂欢',i:['霓虹','舞池']},
{s:'h5',t:['night'],c:'聚会上你笑得最大声，回家的电梯里，笑容一层一层卸了下来。',m:'孤独',i:['笑容','面具']},
{s:'h5',t:['night'],c:'朋友圈都挺好的，只有你知道那张笑脸是修过图的。',m:'孤独',i:['人群','伤口']},
{s:'h6',t:['evening'],c:'你把伞往对方那边斜了过去，自己半边肩膀淋在雨里。',m:'陪伴',i:['雨','伞']},
{s:'h6',t:['night'],c:'你说「到家说一声」，然后真的抱着手机，等到了那条消息。',m:'想念',i:['牵挂','雨']},
{s:'h7',t:['all'],c:'有人陪你慢慢走，把大段的路拆成了一小步一小步，谁都不着急。',m:'陪伴',i:['陪伴','脚印']},
{s:'h7',t:['afternoon'],c:'你们在路口选了远的那条，多走的十分钟都是赚到的。',m:'治愈',i:['路口','陪伴']},
{s:'h8',t:['night'],c:'相册忽然跳出去年今天的回忆，你愣了一下，才想起那天你也在这座城市。',m:'遗憾',i:['照片','时间']},
{s:'h8',t:['night'],c:'旧照片里的自己比现在年轻，也比现在不敢，你替他把后面的路走完了。',m:'治愈',i:['照片','释然']},
{s:'h9',t:['morning'],c:'没人鼓掌也没关系，你在通勤路上把昨天的稿子又改了一版。',m:'热血',i:['梦想','坚持']},
{s:'h9',t:['night'],c:'排练到深夜，泡面还冒着热气，你把副歌又磨了一遍。',m:'孤独',i:['排练室','灯光']},
{s:'h10',t:['evening'],c:'你偏把难过的部分跳过去，音量调大两格，节奏替你把胸口撞开。',m:'治愈',i:['音量','节奏']},
{s:'h10',t:['night'],c:'慢歌刚起头你就切了歌，今晚不许自己往下沉。',m:'热血',i:['节奏','痊愈']},
{s:'h11',t:['morning'],c:'今天有一场硬仗，你把待办排成阵型，第一个进会议室占好了位置。',m:'热血',i:['战鼓','人群']},
{s:'h11',t:['evening'],c:'复盘会上你第一个举手，把该说的话摆上了台面。',m:'热血',i:['旗帜','呐喊']},
{s:'h12',t:['afternoon'],c:'一群人笑到最大声的那一秒，你悄悄按下了心里的录制键。',m:'陪伴',i:['笑','夏天']},
{s:'h12',t:['evening'],c:'散伙饭吃到最后一刻，有人提议明年今天还坐这一桌。',m:'陪伴',i:['毕业','单车']},
{s:'h13',t:['all'],c:'你临时拐了个弯，把收藏夹里放了三年的那家店，变成了今天的晚饭。',m:'热血',i:['出发','冲动']},
{s:'h13',t:['morning'],c:'你把「等有空」改成「就现在」，请了半天假去办那件一直拖着的事。',m:'热血',i:['清单','车票']},
{s:'h14',t:['morning'],c:'新的一周第一缕闹钟响起，你决定把上周的自己留在上周。',m:'热血',i:['重启','清晨']},
{s:'h14',t:['afternoon'],c:'你给简历改了个新开头，像给人生按了一次存档再读档。',m:'治愈',i:['勇气','分岔']},
{s:'h15',t:['night'],c:'你把重要的人都约到了同一晚，好像明天真的有什么要来。',m:'陪伴',i:['末日','拥抱']},
{s:'h15',t:['night'],c:'传闻里的最后一晚，你认真地把明天想了一遍，然后睡得很好。',m:'治愈',i:['船票','拥抱']},
{s:'h16',t:['evening'],c:'有人在场子上点了首老歌，前奏一起，全场都跟着把副歌唱完了。',m:'陪伴',i:['车站','恋人']},
{s:'h16',t:['night'],c:'你听人唱完一首闽南语老歌，忽然听懂了聚散两个字。',m:'遗憾',i:['离别','雨']},
{s:'h17',t:['afternoon'],c:'抽屉里翻出一张旧车票，你捏着它站了一会儿，像回去了一趟。',m:'想念',i:['旧物','回忆']},
{s:'h17',t:['night'],c:'你把童年动画的主题曲找出来听，一秒回到写作业的那个夏天。',m:'治愈',i:['童年','回忆']},
{s:'h18',t:['morning'],c:'鼓点一响你就进入状态，今天的心跳特别跟拍。',m:'热血',i:['鼓点','热血']},
{s:'h18',t:['evening'],c:'球赛最后一节，你跟着全场一起站起来，嗓子都喊亮了。',m:'狂欢',i:['号角','对决']}
];
const MOOD_WORD={热血:'不服',想念:'想念',遗憾:'遗憾',狂欢:'想跳',孤独:'安静',陪伴:'踏实',迷茫:'恍惚',治愈:'松了口气'};
function slotNow(){const h=new Date().getHours();return h<5?'night':h<11?'morning':h<14?'midday':h<18?'afternoon':h<23?'evening':'night'}
let fidSeq=0;
/* 句式模板：避免每张卡都是「时间，城市。+场景」同一个腔调 */
const stripEnd=s=>s.replace(/[。！？]$/,'');
const TEXT_TPL=[
 f=>`${f.time}，${f.city}。${f.core}`,
 f=>`${f.city}，${f.time}。${f.core}`,
 f=>`${f.core}`,
 f=>`${f.time}。${f.core}`,
 f=>`${stripEnd(f.core)}——${f.city}，${f.time}。`,
 f=>`在${f.city}，${f.time}。${f.core}`,
 f=>{const i=f.core.indexOf('，');return (i>8&&f.core.length>24)?`${f.time}，${f.city}。${f.core.slice(0,i+1)}\n${f.core.slice(i+1)}`:`${f.time}，${f.city}。${f.core}`}
];
const HINTS=['这段此刻，连着一首你没料到的歌','先别猜——它连着哪首歌','收下它，后面有一首歌在等你','每个瞬间，都有一首现成的歌'];
let recentSongs=[],lastTpl=-1,lastHint=-1;
function drawFragment(){
  const slot=slotNow();
  let fit=SEEDS.filter(x=>(x.t.includes(slot)||x.t.includes('all'))&&!recentSongs.includes(x.s));
  if(!fit.length){recentSongs=[];fit=SEEDS.filter(x=>x.t.includes(slot)||x.t.includes('all'))}
  const seed=fit[Math.floor(Math.random()*fit.length)];
  recentSongs.push(seed.s);if(recentSongs.length>10)recentSongs.shift();
  const city=CITIES[Math.floor(Math.random()*CITIES.length)];
  const tKey=seed.t.includes('all')?slot:(seed.t.includes(slot)?slot:seed.t[0]);
  const tp=TIMES[tKey];
  const time=tp[Math.floor(Math.random()*tp.length)];
  let ti;do{ti=Math.floor(Math.random()*TEXT_TPL.length)}while(ti===lastTpl);lastTpl=ti;
  let hi;do{hi=Math.floor(Math.random()*HINTS.length)}while(hi===lastHint);lastHint=hi;
  fidSeq++;
  const f={id:'f'+fidSeq,song:seed.s,slot:tKey,city,time,core:seed.c,mood:seed.m,im:seed.i,hint:HINTS[hi],text:''};
  f.text=TEXT_TPL[ti](f);
  return f
}

/* ===== 3. 原创词库：每行标 韵脚/气口(1短2中3长)/情绪/意象 —— 全部原创，不含任何既有歌词 ===== */
const L=(t,r,b,m,im)=>({t,r,b,m,im});
const LINE_BANK=[
/* 热血 */
L('路灯把影子拉成了旗','ang',2,'热血',['夜路','路灯']),L('风把外套吹成一面帆','an',2,'热血',['风','逆风']),
L('我把不服气攥出了汗','an',2,'热血',['握拳','汗水']),L('天台的风替我喊了一嗓','ang',3,'热血',['天台','逆风']),
L('这一局还没到终场','ang',2,'热血',['坚持']),L('心跳是不肯降的鼓点','an',2,'热血',['鼓点','心跳']),
L('输给谁都别输给昨天','an',2,'热血',['时间']),L('把「算了」改口成「再来」','ai',2,'热血',['坚持']),
L('汗水替我把话说完','an',2,'热血',['汗水']),L('伤口结痂变成了勋章','ang',2,'热血',['伤口']),
L('逆着人潮走也不慌','ang',2,'热血',['人潮','逆风']),L('明天的我会在场','ang',1,'热血',['时间']),
/* 想念 */
L('旧照片在口袋里发烫','ang',2,'想念',['旧照片']),L('你的名字停在输入框','ang',2,'想念',['牵挂']),
L('想念是退不完的潮汐','i',2,'想念',['海','回忆']),L('雨声把夜晚下得很长','ang',2,'想念',['雨','深夜']),
L('我们隔着一整个曾经','ing',2,'想念',['时间']),L('你那边的天亮了没','ei',1,'想念',['清晨']),
L('把想说的话存进草稿','ao',2,'想念',['牵挂']),L('梦是唯一通车的桥','ao',2,'想念',['梦']),
L('回忆比路灯亮得早','ao',2,'想念',['路灯','回忆']),L('你的笑还留在那一年','an',2,'想念',['回忆']),
L('晚安说了却没睡着','ao',2,'想念',['深夜']),L('风一吹就想起那件外套','ao',2,'想念',['风','旧物']),
/* 遗憾 */
L('伞下的位置空了一半','an',2,'遗憾',['雨','伞']),L('我们输给了「后来」','ai',2,'遗憾',['时间']),
L('约定散落在搬家纸箱','ang',2,'遗憾',['约定','旧物']),L('那年的夏天没有回放','ang',2,'遗憾',['夏天','回忆']),
L('你走后雨一直没停','ing',2,'遗憾',['雨']),L('故事讲到一半就散场','ang',2,'遗憾',['离别']),
L('把抱歉留在了风里','i',2,'遗憾',['风']),L('青春是一张单程车票','ao',2,'遗憾',['车站','时光']),
L('末班车没等来那句挽留','ou',3,'遗憾',['车站','离别']),L('有些话过期就作废','ei',2,'遗憾',['时间']),
L('站台的风比昨天凉','ang',2,'遗憾',['车站','风']),L('合影里少了一个人的肩','an',3,'遗憾',['旧照片']),
/* 治愈 */
L('热汤冒着白色的雾气','i',2,'治愈',['食物','夜色']),L('有人把伞斜向你这边','an',2,'治愈',['伞','陪伴']),
L('路灯一盏一盏亮起来','ai',2,'治愈',['路灯','夜色']),L('明天的事交给明天','an',2,'治愈',['时间']),
L('晚风把眉头吹开了','ai',2,'治愈',['风']),L('热水把一天的疲惫冲走','ou',3,'治愈',['夜色']),
L('猫在窗台上补了个觉','ao',2,'治愈',['窗台','童年']),L('你值得一场好睡眠','an',2,'治愈',['深夜']),
L('云散开，天自己蓝起来','ai',2,'治愈',['天空']),L('小事顺了就是好日子','i',2,'治愈',['夏天']),
L('世界温柔得像一碗汤','ang',2,'治愈',['食物']),L('把自己还给自己','i',1,'治愈',['释然']),
/* 狂欢 */
L('低音把地板敲成心跳','ao',2,'狂欢',['低音','舞池']),L('霓虹淌进眼睛里','i',2,'狂欢',['霓虹','夜色']),
L('把这一周全甩进音浪','ang',2,'狂欢',['音浪','周末']),L('副歌一响全场起飞','ei',2,'狂欢',['副歌','跳跃']),
L('汗水在灯下闪成星海','ai',2,'狂欢',['汗水','灯光']),L('今晚不许任何人低头','ou',2,'狂欢',['舞池']),
L('节奏替我们把烦恼清场','ang',2,'狂欢',['节奏']),L('跳到整条街都羡慕','u',2,'狂欢',['街','跳跃']),
L('手举起来就不要放下','a',2,'狂欢',['跳跃']),L('这一秒属于我们自己','i',2,'狂欢',['时光']),
L('音浪把天花板掀开','ai',2,'狂欢',['音浪']),L('周末生来就是为了起飞','ei',2,'狂欢',['周末']),
/* 孤独 */
L('便利店的灯亮到天明','ing',2,'孤独',['便利店','深夜']),L('人潮把我冲成了背景','ing',2,'孤独',['人潮','灰色']),
L('地铁开往没名字的站','an',2,'孤独',['地铁','城市']),L('房间安静得有回声','eng',2,'孤独',['夜色']),
L('一个人的火锅也沸腾','eng',2,'孤独',['食物']),L('只有影子陪我到路口','ou',2,'孤独',['夜路','街']),
L('手机暗成了一小块夜空','ong',2,'孤独',['深夜','牵挂']),L('热闹是借来的外套','ao',2,'孤独',['外套','人群']),
L('孤独住进了深夜的班次','i',2,'孤独',['深夜']),L('把心事晾在天台','ai',2,'孤独',['天台','夜色']),
L('钥匙转动声在楼道回响','ang',2,'孤独',['夜归']),L('月亮也在加班','an',1,'孤独',['月亮','夜色']),
/* 陪伴 */
L('有人把热茶推到你面前','an',2,'陪伴',['食物','陪伴']),L('并肩走的路短也变长','ang',2,'陪伴',['街','陪伴']),
L('你说什么我都接得住','u',2,'陪伴',['陪伴']),L('老友的笑话过期不换','an',2,'陪伴',['老友','回忆']),
L('一盏灯为你留到很晚','an',2,'陪伴',['灯光','深夜']),L('你的名字这边有回音','in',2,'陪伴',['牵挂']),
L('再晚也有人等你到家','a',2,'陪伴',['夜归','陪伴']),L('把肩膀借你靠一站','an',2,'陪伴',['车站','陪伴']),
L('同行的人不问快慢','an',2,'陪伴',['陪伴','脚印']),L('碗筷一碰就是家','a',1,'陪伴',['食物','陪伴']),
L('你转身我就在','ai',1,'陪伴',['陪伴']),L('一起把日子过成段子','i',2,'陪伴',['老友','时光']),
/* 迷茫 */
L('十字路口的红灯很长','ang',2,'迷茫',['路口','城市']),L('地图上找不到此刻','i',2,'迷茫',['地图','时光']),
L('答案还在路上堵着车','e',2,'迷茫',['路','灰色']),L('镜子里的自己有点陌生','eng',2,'迷茫',['镜子','时间']),
L('选择太多反而站着不动','ong',2,'迷茫',['分岔']),L('风往哪吹就先往哪走','ou',2,'迷茫',['风','路']),
L('把问题带进梦里问一遍','an',2,'迷茫',['梦','深夜']),L('导航重新计算中','ong',1,'迷茫',['导航','路']),
L('明天是个未接来电','an',2,'迷茫',['手机','时间']),L('我在人海里丢了频道','ao',2,'迷茫',['人潮','灰色']),
L('青春的题还没答完','an',2,'迷茫',['时间']),L('先走到下一个路口','ou',1,'迷茫',['路口','路']),
/* 补充短气口：让主歌收尾、副歌收口有足够的韵脚可选 */
L('别管明天','an',1,'热血',['时间']),L('就现在','ai',1,'热血',['时间','出发']),
L('风开始合唱','ang',1,'治愈',['风']),L('唱完这一场','ang',1,'狂欢',['副歌']),
L('天快亮','ang',1,'治愈',['清晨']),L('别怕','a',1,'治愈',['勇气']),
L('慢慢来','ai',1,'陪伴',['陪伴']),L('我在','ai',1,'陪伴',['陪伴']),
L('梦还滚烫','ang',1,'热血',['梦']),L('别回头','ou',1,'热血',['路']),
L('月亮不睡','ei',1,'孤独',['月亮','深夜']),L('夜色刚好','ao',1,'治愈',['夜色']),
L('风变温柔','ou',1,'治愈',['风']),L('我们同路','u',1,'陪伴',['陪伴']),
L('别想太远','an',1,'迷茫',['时间']),
/* 长气口（b3）：给副歌蓄力用 */
L('把整条街的灯都唱亮','ang',3,'热血',['街','灯光']),L('眼泪在星空下变成了糖','ang',3,'治愈',['星空','眼泪']),
L('把没说出口的都交给合唱','ang',3,'陪伴',['毕业','老友']),L('我们隔着人海互相发光','ang',3,'陪伴',['人潮','灯光']),
L('时间在副歌里慢了半拍','ai',3,'遗憾',['时间','副歌']),L('回忆在天台上晾成一排','ai',3,'想念',['天台','回忆']),
L('我们把青春喝成了长镜头','ou',3,'陪伴',['老友','时光']),L('让风把犹豫都带走','ou',3,'迷茫',['风','路']),
L('把遗憾折成纸飞机放行','ing',3,'遗憾',['童年','释然']),L('心跳撞碎了整座城市的安静','ing',3,'狂欢',['心跳','城市']),
L('我们把日子过成了诗行','ang',3,'陪伴',['时光']),L('把整个夏天的风都收进胸膛','ang',3,'治愈',['夏天','风']),
L('时间把伤口酿成了酒','ou',3,'遗憾',['时间','伤口']),L('我们在人海里认出彼此','i',3,'陪伴',['人潮','相遇']),
L('雨把整座城洗了一遍','an',3,'治愈',['雨','城市']),
/* 短气口（b1）：给副歌收口用 */
L('副歌还没完','an',1,'狂欢',['副歌']),L('雨停在伞沿','an',1,'治愈',['雨','伞']),
L('风替我回答','a',1,'迷茫',['风']),L('灯还替我亮着','e',1,'孤独',['灯光','深夜']),
L('我们别散','an',1,'陪伴',['陪伴']),L('明天见','an',1,'治愈',['时间']),
L('把梦做完','an',1,'热血',['梦']),L('潮汐退回海','ai',1,'想念',['海','回忆'])
];


/* ===== 4. 状态（2026-08-26 重构：单页流 · 抽到即收 · 一步刻盘） =====
   交互收敛：去掉了 Tab 页、匹配页、"点卡收下"二次确认、悬浮 CTA 条与改写步骤。
   主流程只剩一条线：抽三段（自动入册）→ 刻盘（匹配自动完成）→ 播放/换一版/分享。 */
let drawRound=0,picked=[],links={},editTexts={},record=null,nonce=0,shelf=[];
let audio=null,master=null,delay=null,playing=false,timers=[],shareUrl='';
let fragStore={},lastFrag=null;
const $=id=>document.getElementById(id);
const reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ===== 四屏导航（水彩演唱会 v4）===== */
function showScreen(name){
  ['Home','Draw','Song','Live'].forEach(n=>{
    const el=$('screen'+n);if(el)el.classList.toggle('active',n===name);
  });
  document.body.dataset.screen=name.toLowerCase();
  if($('tabHome'))$('tabHome').classList.toggle('here',name==='Home');
  if($('tabLive'))$('tabLive').classList.toggle('here',name==='Live');
  window.scrollTo({top:0,behavior:'auto'});
  if(typeof syncPlayer==='function')syncPlayer();
}
function pickedFrags(){return picked.map(id=>fragStore[id]).filter(Boolean)}
let toastTimer=null;
function showToast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}
function stopPlayback(){playing=false;timers.forEach(clearTimeout);timers=[];document.body.classList.remove('playing');if(audio&&audio.state==='running')audio.suspend()}
function syncPlayer(){const p=$('player');if(!p)return;p.classList.toggle('show',!!record&&!$('shareSheet').classList.contains('open')&&document.body.dataset.screen!=='song')}

/* ===== 5. 收集：抽到即入册，三段成唱片 ===== */
function drawOne(){
  if(picked.length>=3||record)return;
  const f=drawFragment();drawRound++;
  fragStore[f.id]=f;picked.push(f.id);lastFrag=f;
  renderFlow(true);
}
function removeFrag(id){
  const i=picked.indexOf(id);if(i<0)return;
  picked.splice(i,1);delete links[id];delete fragStore[id];
  if(lastFrag&&lastFrag.id===id)lastFrag=picked.length?fragStore[picked[picked.length-1]]:null;
  renderFlow(false);
}
function renderFlow(animate){
  $('slots').innerHTML=[0,1,2].map(i=>{
    const id=picked[i];
    if(!id)return `<div class="slot empty"><span class="no mono">${String(i+1).padStart(2,'0')}</span><span class="slot-word">等一段此刻</span></div>`;
    const f=fragStore[id];
    return `<div class="slot filled"><button class="slot-x" data-id="${id}" aria-label="不要这段"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button><span class="no mono">${String(i+1).padStart(2,'0')}</span><span class="slot-city">${f.city}</span><span class="slot-mood">${MOOD_WORD[f.mood]}</span></div>`;
  }).join('');
  $('slots').querySelectorAll('.slot-x').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();removeFrag(b.dataset.id)}));
  const st=$('stage');
  if(lastFrag&&picked.includes(lastFrag.id)){
    const f=lastFrag;
    st.innerHTML=`<article class="ticket${animate&&!reduced?' in':''}">
      <div class="t-top"><span class="t-no mono">此刻 NO.${String(drawRound).padStart(3,'0')}</span><span class="t-city">${f.city}</span></div>
      <p class="t-text">${f.text}</p>
      <div class="t-meta mono">${f.time} · ${MOOD_WORD[f.mood]}</div>
      <p class="t-hint">${f.hint}</p>
    </article>`;
  }else if(!picked.length){
    st.innerHTML='<div class="stage-empty">第一段，会从你此刻的城市、时间和心情里抽出来。</div>';
  }else{
    st.innerHTML='';
  }
  const full=picked.length>=3;
  $('mainBtn').classList.toggle('engrave',full);
  $('mainBtnText').textContent=full?'刻盘':'抽一段';
  $('mainBtn').setAttribute('aria-label',full?'三段已收齐，刻成我的唱片':'抽一段新的此刻');
  $('slotHint').textContent=full?'收满了，可以刻盘':`还差 ${3-picked.length} 段 · 每段连着一首歌`;
  $('countNum')&&($('countNum').textContent=String(picked.length));
  const dots=[0,1,2].map(i=>`<i${i<picked.length?' class="on"':''}></i>`).join('');
  const dotBox=document.querySelector('.dots');if(dotBox)dotBox.innerHTML=dots;
  const lb=$('flowLabel');if(lb)lb.textContent=full?'三段已收齐 · 刻成你的城市唱片':'此刻 · 连去五月天的歌';
}

/* ===== 6. 刻盘：匹配自动完成，显影 1.9 秒 ===== */
function engrave(){
  if(picked.length!==3)return;
  stopPlayback();
  pickedFrags().forEach(f=>{if(!links[f.id])links[f.id]=topSongs(f,3)[0].id});
  $('pressOverlay').classList.add('show');
  const steps=['翻出你的三段此刻……','韵脚在排队……','气口对齐中……','副歌蓄力……','母带刻纹中……'];
  let i=0;$('pressText').textContent=steps[0];
  const iv=setInterval(()=>{$('pressText').textContent=steps[++i%steps.length]},460);
  setTimeout(()=>{clearInterval(iv);compose();$('pressOverlay').classList.remove('show');showRecord();saveShelf()},reduced?120:1900);
}
function remix(){
  if(picked.length!==3)return;
  stopPlayback();nonce++;
  $('pressOverlay').classList.add('show');
  $('pressText').textContent='再拼一版……';
  setTimeout(()=>{compose();$('pressOverlay').classList.remove('show');renderRecord();saveShelf();renderShelf();showToast('拼了一版新的')},reduced?120:1100);
}
function showRecord(){
  renderRecord();
  $('recordSec').classList.remove('hidden');
  renderShelf();syncPlayer();showScreen('Song');
}
function renderRecord(){
  $('coverTitle').textContent=record.title;
  $('coverCode').textContent=record.city+' · ORIGINAL';
  $('recTitle').textContent=record.title;
  $('recThesis').textContent=record.thesis;
  $('nowPlaying').textContent=record.title;
  const dom=songOf(record.songId);
  $('linkedSong').textContent=dom?dom.name:'';
  const live=picked.length===3&&record.seed.indexOf(picked.join(','))===0;
  $('swapRow').classList.toggle('hidden',!live);
  $('remixBtn').classList.toggle('hidden',!live);
  if(live){
    const first=pickedFrags()[0];
    const tops=topSongs(first,3);
    $('swapChips').innerHTML=tops.map(s=>`<button class="chip${s.id===links[first.id]?' on':''}" data-s="${s.id}">${s.name.replace(/[《》]/g,'')}</button>`).join('');
    $('swapChips').querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
      if(links[first.id]===c.dataset.s)return;
      links[first.id]=c.dataset.s;stopPlayback();compose();renderRecord();showToast(`换上了${songOf(c.dataset.s).name}的情绪`);
    }));
  }
  $('lyricSheet').innerHTML=record.sections.map(sec=>`<div class="lyr-sec"><span class="lyr-label mono">${sec.label}</span>${sec.lines.map(l=>`<p class="lyr-line">${l}</p>`).join('')}</div>`).join('');
  $('nowMeta').textContent=`${record.mood} · 免费文字生音乐`;
  if(record.generatedMusicId)setMusicStatus('真实歌曲已生成 · 由歌词与音乐描述驱动（免费开源模型）','ready');
  else if(musicProviderReady)setMusicStatus('免费 ACE-Step 1.5 已就绪 · 播放时生成真实歌曲','ready');
  else setMusicStatus('正在检查免费文字生音乐引擎……');
  if(!record.generatedMusicId&&!musicProviderReady)checkMusicProvider();
}
function startOver(){
  stopPlayback();
  record=null;picked=[];links={};editTexts={};fragStore={};lastFrag=null;drawRound=0;
  renderFlow(false);renderShelf();syncPlayer();showScreen('Draw');
}

/* ===== 7. 唱片架（本机记忆） ===== */
function saveShelf(){try{const arr=shelf.filter(r=>r.seed!==record.seed);arr.unshift(record);shelf=arr.slice(0,12);localStorage.setItem('mayday_shelf',JSON.stringify(shelf))}catch(e){}}
function loadShelf(){try{shelf=JSON.parse(localStorage.getItem('mayday_shelf')||'[]')}catch(e){shelf=[]}}
/* ===== 7. 唱片架（本机记忆 · 瀑布流 + 情绪筛选）===== */
let moodFilter='全部';
function saveShelf(){try{const arr=shelf.filter(r=>r.seed!==record.seed);arr.unshift(record);shelf=arr.slice(0,12);localStorage.setItem('mayday_shelf',JSON.stringify(shelf))}catch(e){}}
function loadShelf(){try{shelf=JSON.parse(localStorage.getItem('mayday_shelf')||'[]')}catch(e){shelf=[]}}
const MOOD_TINT={'不服':'var(--lav)','想念':'var(--blue)','遗憾':'#2a3548','想跳':'var(--coral)','安静':'var(--mint)','踏实':'var(--gold)','恍惚':'#9db8d6','松了口气':'var(--mint)'};
function renderMoodFilter(){
  const box=$('moodFilter');if(!box)return;
  const moods=['全部',...Array.from(new Set(shelf.map(r=>MOOD_WORD[r.mood]||r.mood)))];
  box.innerHTML=moods.map(m=>`<button class="pill${m===moodFilter?' on':''}" data-m="${m}">${m}</button>`).join('');
  box.querySelectorAll('.pill').forEach(p=>p.addEventListener('click',()=>{moodFilter=p.dataset.m;renderShelf()}));
}
function renderShelf(){
  renderMoodFilter();
  const list=$('shelfList');if(!list)return;
  const rows=moodFilter==='全部'?shelf:shelf.filter(r=>(MOOD_WORD[r.mood]||r.mood)===moodFilter);
  if($('shelfCount'))$('shelfCount').textContent=`${rows.length} 张`;
  if(!rows.length){list.innerHTML='<div class="live-empty">还没有现场。<br>去抽三段此刻，刻下第一张城市唱片。</div>';return}
  list.innerHTML=rows.map((r,i)=>{
    const tint=MOOD_TINT[r.mood]||'var(--blue)';
    const shortDate=(r.date||'').replace(/^\d{4}年/,'').replace('月','/').replace('日','');
    return `<button class="wf-item" data-i="${i}">
      <span class="wf-cover" style="background:${tint}"><span class="wf-disc"></span></span>
      <span class="wf-meta"><b>${r.title}</b><span>${r.city} · ${MOOD_WORD[r.mood]||r.mood} · ${shortDate}</span></span>
    </button>`}).join('');
  list.querySelectorAll('.wf-item').forEach(b=>b.addEventListener('click',()=>{
    stopPlayback();
    record=shelf[+b.dataset.i];
    renderRecord();syncPlayer();showScreen('Song');
  }));
}
/* ===== 语义匹配（自动完成，不再单独一步） ===== */
function scoreSong(f,s){let sc=0;if(s.id===f.song)sc+=3;f.im.forEach(t=>{if(s.tags.includes(t))sc+=1});if(s.moods.includes(f.mood))sc+=2;return sc}
function topSongs(f,n){return MAYDAY_LIB.map(s=>({s,sc:scoreSong(f,s)})).sort((a,b)=>b.sc-a.sc).slice(0,n).map(x=>x.s)}
/* ===== 8. 气口拼贴引擎：原创词库 → 主歌/副歌/桥段 ===== */
function rng(seed){let s=2166136261;for(const c of seed){s^=c.charCodeAt(0);s=Math.imul(s,16777619)>>>0}return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
function seededShuffle(arr,seed){const r=rng(seed);return arr.map(x=>[r(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1])}
function pickLines(mood,rhyme,breath,imTags,n,used,seed){
  let c=LINE_BANK.filter(l=>!used.has(l.t)&&l.r===rhyme&&l.b===breath&&(l.m===mood||imTags.some(t=>l.im.includes(t))));
  if(c.length<n)c=LINE_BANK.filter(l=>!used.has(l.t)&&l.r===rhyme&&l.b===breath);
  if(c.length<n)c=LINE_BANK.filter(l=>!used.has(l.t)&&l.r===rhyme);
  if(c.length<n)c=LINE_BANK.filter(l=>!used.has(l.t)&&l.m===mood);
  const out=seededShuffle(c,seed+breath+n).slice(0,n);
  out.forEach(l=>used.add(l.t));
  return out
}
function bestRhyme(mood,imTags,seed,breaths){
  const tally={};
  LINE_BANK.forEach(l=>{if(l.m===mood||imTags.some(t=>l.im.includes(t))){(tally[l.r]=tally[l.r]||[]).push(l)}});
  const ranked=Object.keys(tally).sort((a,b)=>tally[b].length-tally[a].length);
  const ok=ranked.filter(r=>breaths.every(b=>tally[r].some(l=>l.b===b)));
  const pool=ok.length?ok:(ranked.length?ranked:['ang']);
  return pool[Math.floor(rng(seed)()*pool.length)%pool.length]
}
function makeTitle(frags,domSong,city,seed){
  const slot=frags[0].slot,tn=TIME_NOUN[slot]||'深夜';
  const im=frags.map(f=>f.im).flat();
  const top=seededShuffle(im,seed+'im').slice(0,2);
  const r=rng(seed+'t')();
  if(r<.34)return `《${city}的${tn}》`;
  if(r<.67&&top.length===2)return `《${top[0]}与${top[1]}》`;
  if(domSong.name.length<=8)return `《${domSong.name.replace(/[《》]/g,'')}那一刻》`;
  return `《${city}的${tn}》`
}
function compose(){
  const frags=pickedFrags();
  frags.forEach(f=>{f.text=editTexts[f.id]||f.text});
  const seed=picked.join(',')+'|'+Object.values(links).join(',')+'|'+nonce;
  const domSong=songOf(links[frags[0].id])||songOf(frags[0].song);
  const moodCount={};frags.forEach(f=>{moodCount[f.mood]=(moodCount[f.mood]||0)+1});
  const mood=Object.keys(moodCount).sort((a,b)=>moodCount[b]-moodCount[a])[0];
  const city=frags[0].city;
  const imTags=frags.map(f=>f.im).flat();
  const used=new Set();
  const rV=bestRhyme(mood,imTags,seed+'v',[1,2]);
  const rV2=bestRhyme(mood,imTags,seed+'vb',[1,2]);
  const rC=bestRhyme(mood,imTags,seed+'c',[1,2,3]);
  const vA=[...pickLines(mood,rV,2,imTags,2,used,seed+'a1'),...pickLines(mood,rV,1,imTags,2,used,seed+'a2')];
  const vB=[...pickLines(mood,rV2,2,imTags,2,used,seed+'b1'),...pickLines(mood,rV2,1,imTags,2,used,seed+'b2')];
  const ch=[...pickLines(mood,rC,3,imTags,2,used,seed+'c1'),...pickLines(mood,rC,2,imTags,1,used,seed+'c2'),...pickLines(mood,rC,1,imTags,1,used,seed+'c3')];
  const tail=ch[ch.length-1].t;
  const br=[...pickLines(mood,rV,1,imTags,2,used,seed+'d1'),...pickLines(mood,rV,2,imTags,1,used,seed+'d2')];
  const title=makeTitle(frags,domSong,city,seed);
  const thesis=`把${city}的${TIME_NOUN[frags[0].slot]||'深夜'}、${frags.length}个心动的瞬间，连去${domSong.name}的情绪——${domSong.arc}，刻成一张只此一张的城市唱片。`;
  record={title,thesis,mood,city,style:domSong.style,songId:domSong.id,date:new Date().toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric'}),seed,sections:[
    {label:'主歌 A',lines:vA.map(l=>l.t)},
    {label:'主歌 B',lines:vB.map(l=>l.t)},
    {label:'副歌',lines:[...ch.map(l=>l.t),tail]},
    {label:'桥段',lines:br.map(l=>l.t)}
  ],chorusTail:tail};
  return record
}
/* ===== 10. Web Audio：分段编曲（前奏/主歌/副歌/桥段/副歌再现） ===== */
function ensureAudio(){if(!audio){audio=new (window.AudioContext||window.webkitAudioContext)();master=audio.createGain();master.gain.value=.18;delay=audio.createDelay(1);delay.delayTime.value=.28;const fb=audio.createGain();fb.gain.value=.22;delay.connect(fb).connect(delay);delay.connect(master);master.connect(audio.destination)}if(audio.state==='suspended')audio.resume()}
function note(freq,time,dur,type='sine',vol=.1,panned=0){const o=audio.createOscillator(),g=audio.createGain(),p=audio.createStereoPanner();o.type=type;o.frequency.setValueAtTime(freq,time);p.pan.value=panned;g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(vol,time+.025);g.gain.exponentialRampToValueAtTime(.001,time+dur);o.connect(g).connect(p).connect(master);if(type!=='sine')g.connect(delay);o.start(time);o.stop(time+dur+.03)}
function noise(time,dur,vol){const b=audio.createBuffer(1,audio.sampleRate*dur,audio.sampleRate),data=b.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2);const s=audio.createBufferSource(),g=audio.createGain(),f=audio.createBiquadFilter();s.buffer=b;f.type='lowpass';f.frequency.value=1800;g.gain.setValueAtTime(vol,time);g.gain.exponentialRampToValueAtTime(.001,time+dur);s.connect(f).connect(g).connect(master);s.start(time)}
/* ===== 10. Web Audio · 歌词驱动作曲引擎 =====
   每个字 → 一个音；气口 → 行间休止；韵脚行 → 落长音贴和弦；
   情绪 → 调式/速度/和声进行；段落 → 编曲密度。
   同一张唱片（seed+歌词）永远生成同一首歌，不同唱片必然不同。 */
function degToSemi(dna,deg){return dna.scale[deg%dna.scale.length]+12*Math.floor(deg/dna.scale.length)}
const SONG_DNA={
'热血':{bpm:126,keys:[246.94,261.63,293.66],scale:[0,2,4,7,9],wave:'square',contour:1,drums:1,progs:[[0,7,9,5],[0,5,7,7],[9,5,0,7]]},
'狂欢':{bpm:128,keys:[261.63,293.66,329.63],scale:[0,2,4,7,9],wave:'sawtooth',contour:1,drums:1,progs:[[0,7,9,7],[0,9,5,7],[5,7,9,0]]},
'治愈':{bpm:92,keys:[261.63,246.94,293.66],scale:[0,2,4,7,9],wave:'triangle',contour:1,drums:.5,progs:[[0,5,9,7],[0,7,5,5],[9,5,7,0]]},
'陪伴':{bpm:96,keys:[246.94,220,261.63],scale:[0,2,4,7,9],wave:'triangle',contour:0,drums:.6,progs:[[0,7,5,9],[0,5,9,7],[9,5,0,5]]},
'想念':{bpm:72,keys:[220,196,174.61],scale:[0,3,5,7,10],wave:'sine',contour:-1,drums:.35,progs:[[0,5,7,3],[0,3,5,5],[8,5,3,0]]},
'遗憾':{bpm:76,keys:[220,207.65,196],scale:[0,3,5,7,10],wave:'sine',contour:-1,drums:.35,progs:[[0,8,5,7],[0,5,3,7],[8,7,5,0]]},
'孤独':{bpm:68,keys:[196,174.61,164.81],scale:[0,3,5,7,10],wave:'sine',contour:-1,drums:.2,progs:[[0,3,8,5],[0,5,3,3],[8,3,0,5]]},
'迷茫':{bpm:84,keys:[220,233.08,196],scale:[0,2,3,7,9],wave:'triangle',contour:0,drums:.4,progs:[[0,2,5,7],[0,7,2,5],[5,2,9,0]]}
};
function lead(freq,time,dur,type,vol){
  const o=audio.createOscillator(),g=audio.createGain(),p=audio.createStereoPanner();
  const lfo=audio.createOscillator(),lg=audio.createGain();
  o.type=type;o.frequency.setValueAtTime(freq,time);
  lfo.frequency.value=5.4;lg.gain.value=freq*.009;
  lfo.connect(lg).connect(o.frequency);lfo.start(time);lfo.stop(time+dur+.05);
  p.pan.value=.14;
  g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(vol,time+.035);g.gain.exponentialRampToValueAtTime(.001,time+dur);
  o.connect(g).connect(p).connect(master);g.connect(delay);
  o.start(time);o.stop(time+dur+.05)
}
function writeSong(rec){
  const r=rng(rec.seed+'|audio');
  const dna=SONG_DNA[rec.mood]||SONG_DNA['治愈'];
  const bpm=Math.round(dna.bpm*(.94+r()*.12));
  const root=dna.keys[Math.floor(r()*dna.keys.length)];
  const prog=dna.progs[Math.floor(r()*dna.progs.length)];
  let lineIdx=0;
  const sections=rec.sections.map(sec=>{
    const kind=sec.label.indexOf('副歌')>-1?'chorus':sec.label.indexOf('桥')>-1?'bridge':'verse';
    const lines=sec.lines.map(t=>{
      const chars=[...t.replace(/[，。！？、…—·「」『』\s]/g,'')].slice(0,12);
      const chordDeg=prog[lineIdx%prog.length];lineIdx++;
      const chordSemis=[0,1,2].map(k=>degToSemi(dna,chordDeg+k*2));
      const notes=[];let deg=4+Math.floor(r()*4);
      const lift=kind==='chorus'?(lineIdx%2===0?1:-1):(dna.contour||0);
      for(let i=0;i<chars.length;i++){
        const step=Math.round(r()*2-1)+lift;
        deg=Math.max(2,Math.min(11,deg+step));
        let semi=degToSemi(dna,deg);
        if(i===chars.length-1){
          let best=chordSemis[0],gap=99;
          for(const cs of chordSemis)for(const oc of[-12,0,12]){const v=cs+oc;if(Math.abs(v-semi)<gap){gap=Math.abs(v-semi);best=v}}
          semi=best;
        }
        const dur=(i===chars.length-1)?(r()<.5?1.5:1):(.25+(r()<.18?.25:0));
        notes.push({semi,dur});
      }
      return{chars:chars.length,notes,chordSemis}
    });
    return{kind,lines}
  });
  const beat=60/bpm;let total=beat*8;
  sections.forEach(sec=>sec.lines.forEach(l=>{total+=l.notes.reduce((s,n)=>s+n.dur*beat,0)+beat*.45}));
  return{bpm,root,prog,dna,sections,total:total+beat*6}
}
function playRecord(){
  if(!record)return;ensureAudio();timers.forEach(clearTimeout);timers=[];
  const song=writeSong(record),beat=60/song.bpm,dna=song.dna;
  let t=audio.currentTime+.06;
  playing=true;document.body.classList.add('playing');
  $('nowPlaying').textContent=record.title;
  $('nowMeta').textContent=`${record.mood} · ${song.bpm} BPM · 歌词逐字成歌`;
  [0,1,2].forEach(k=>note(song.root*Math.pow(2,degToSemi(dna,song.prog[0]+k*2)/12),t,beat*3.6,'sine',.04,(k-1)*.25));
  t+=beat*8;
  let lineCount=0;
  song.sections.forEach(sec=>{
    sec.lines.forEach(line=>{
      const dur=line.notes.reduce((s,n)=>s+n.dur*beat,0);
      line.chordSemis.forEach((s,k)=>note(song.root*Math.pow(2,s/12),t,dur*.96,sec.kind==='bridge'?'sine':dna.wave,sec.kind==='chorus'?.045:sec.kind==='verse'?.034:.028,(k-1)*.25));
      note(song.root*Math.pow(2,line.chordSemis[0]/12)/2,t,beat*.9,'triangle',sec.kind==='chorus'?.12:.07,-.18);
      if(sec.kind==='chorus'&&dna.drums>.3){
        note(90,t,.08,'sine',.16,0);noise(t,.05,.07);
        note(90,t+dur*.5,.08,'sine',.13,0);
        for(let h=.5;h<dur/beat;h+=.5)noise(t+h*beat,.03,.03);
        if(lineCount%2===1)noise(t+dur*.75,.12,.08);
      }else if(sec.kind==='verse'&&dna.drums>.3){note(90,t,.08,'sine',.09,0)}
      let lt=t;
      line.notes.forEach(nn=>{lead(song.root*Math.pow(2,nn.semi/12),lt,nn.dur*beat*.9,dna.wave,sec.kind==='chorus'?.1:.075);lt+=nn.dur*beat});
      lineCount++;t=lt+beat*.45;
    });
    if(sec.kind==='bridge'){note(song.root*2,t,beat*1.6,'sine',.04,.35);t+=beat*2}
  });
  [0,1,2].forEach(k=>note(song.root*Math.pow(2,degToSemi(dna,song.prog[0]+k*2)/12),t,beat*5,'sine',.035,(k-1)*.25));
  timers.push(setTimeout(()=>{playing=false;document.body.classList.remove('playing')},(song.total+beat*5)*1000+300))
}
function toggle(){if(playing){stopPlayback()}else playRecord()}
/* ===== 11. 分享卡：canvas + 桥存相册 ===== */
function openShare(){
  if(!record)return;
  const claimBtn=$('claimShareBtn');
  if(claimBtn){claimBtn.disabled=false;claimBtn.querySelector('span').textContent='我分享给朋友了 · 领 +1 免费额度'}
  shareUrl=location.href.split('#')[0]+'#record='+btoa(encodeURIComponent(JSON.stringify({p:picked,l:links,n:nonce})));
  $('scTitle').textContent=record.title;
  $('scDate').textContent=record.date;
  $('scMeta').textContent=`SIDE A · ${record.city} · 原创词曲 · ${record.mood}`;
  const ch=record.sections.find(s=>s.label==='副歌');
  $('scLyric').innerHTML=ch.lines.slice(0,2).map(l=>`<p>${l}</p>`).join('');
  $('scLink').textContent=shareUrl.replace(/^https?:\/\//,'');
  $('sheetMask').classList.add('open');
  $('shareSheet').classList.add('open');
  syncPlayer()
}
function closeSheet(){$('sheetMask').classList.remove('open');$('shareSheet').classList.remove('open');$('shareSheet').style.transform='';$('sheetMask').style.opacity='';syncPlayer()}
const grabEl=$('sheetGrabber');let drag=null;
function onDragStart(e){if(!$('shareSheet').classList.contains('open'))return;drag={y:e.clientY};try{grabEl.setPointerCapture(e.pointerId)}catch(err){}}
function onDragMove(e){if(!drag)return;const dy=Math.max(0,e.clientY-drag.y);const sh=$('shareSheet');sh.style.transition='none';sh.style.transform=`translateY(${dy}px)`;$('sheetMask').style.opacity=String(Math.max(0,1-dy/420))}
function onDragEnd(e){if(!drag)return;const dy=Math.max(0,e.clientY-drag.y);drag=null;const sh=$('shareSheet');sh.style.transition='';sh.style.transform='';$('sheetMask').style.opacity='';if(dy>110)closeSheet()}
grabEl.addEventListener('pointerdown',onDragStart);
grabEl.addEventListener('pointermove',onDragMove);
grabEl.addEventListener('pointerup',onDragEnd);
grabEl.addEventListener('pointercancel',onDragEnd);
function roundRectPath(x,X,Y,W,H,R){x.beginPath();x.moveTo(X+R,Y);x.arcTo(X+W,Y,X+W,Y+H,R);x.arcTo(X+W,Y+H,X,Y+H,R);x.arcTo(X,Y+H,X,Y,R);x.arcTo(X,Y,X+W,Y,R);x.closePath()}
function wrapLines(x,text,maxW){let cur='';const lines=[];for(const ch of text){if(x.measureText(cur+ch).width>maxW&&cur){lines.push(cur);cur=ch}else cur+=ch}if(cur)lines.push(cur);return lines.slice(0,3)}
async function saveCard(){
  await document.fonts.ready;
  // 水彩插画预载（失败则用渐变兜底）
  let art=null;try{art=await new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src='./assets/watercolor-polaroid.jpg'});}catch(e){}
  const W=1080,H=1560,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  x.fillStyle='#F6F0E5';x.fillRect(0,0,W,H);
  // 顶部眉题行
  x.fillStyle='#8A8079';x.font='500 24px "SF Mono",Menlo,monospace';x.textAlign='left';x.fillText('五月天城市唱片 · 此刻的歌',110,128);
  x.textAlign='right';x.fillText(record.date,W-110,128);
  // 中央竖版白框卡牌（回响调频卡式）
  const CX=96,CY=170,CW=W-192,CH=796,R=44;
  x.save();x.shadowColor='rgba(16,23,34,.18)';x.shadowBlur=44;x.shadowOffsetY=18;
  roundRectPath(x,CX,CY,CW,CH,R);x.fillStyle='#fffdf8';x.fill();x.restore();
  roundRectPath(x,CX,CY,CW,CH,R);x.strokeStyle='rgba(16,23,34,.08)';x.lineWidth=2;x.stroke();
  // 卡内插画（圆角裁剪）
  const IX=CX+26,IY=CY+26,IW=CW-52,IH=CH-186;
  x.save();roundRectPath(x,IX,IY,IW,IH,28);x.clip();
  if(art){const ar=Math.max(IW/art.width,IH/art.height);const dw=art.width*ar,dh=art.height*ar;x.drawImage(art,IX+(IW-dw)/2,IY+(IH-dh)/2,dw,dh)}
  else{const g=x.createLinearGradient(IX,IY,IX+IW,IY+IH);g.addColorStop(0,'#101722');g.addColorStop(.55,'#3D5A80');g.addColorStop(1,'#87BCEB');x.fillStyle=g;x.fillRect(IX,IY,IW,IH)}
  x.restore();
  roundRectPath(x,IX,IY,IW,IH,28);x.strokeStyle='rgba(16,23,34,.06)';x.lineWidth=1.5;x.stroke();
  // 卡内底部：波形线 + 宽字距编号
  x.strokeStyle='#87BCEB';x.lineWidth=3.5;x.lineCap='round';x.beginPath();
  for(let i=0;i<=60;i++){const wx=IX+70+i*(IW-140)/60,wy=IY+IH+62+Math.sin(i*.55)*13;i?x.lineTo(wx,wy):x.moveTo(wx,wy)}
  x.stroke();
  x.fillStyle='#2B2524';x.font='500 26px "SF Mono",Menlo,monospace';x.textAlign='center';
  x.fillText($('scMeta').textContent,W/2,CY+CH-38);
  // 卡外下方：歌名 + 论心句 + 副歌
  const fs=record.title.length>12?56:68;x.fillStyle='#101722';x.font=`700 ${fs}px "Songti SC","STSong","SimSun",serif`;
  const lines=wrapLines(x,record.title,W-260).slice(0,2);let ty=CY+CH+100;lines.forEach(l=>{x.fillText(l,W/2,ty);ty+=Math.round(fs*1.26)});
  x.font='400 26px "PingFang SC","Hiragino Sans GB",sans-serif';x.fillStyle='#6E655E';
  const th=wrapLines(x,record.thesis,W-320).slice(0,2);th.forEach(l=>{x.fillText(l,W/2,ty+10);ty+=40});
  ty+=24;x.fillStyle='#101722';x.font='500 32px "PingFang SC","Hiragino Sans GB",sans-serif';
  const ch=record.sections.find(s=>s.label==='副歌');
  ch.lines.slice(0,2).forEach(l=>{x.fillText(l,W/2,ty);ty+=48});
  // 底部：居中 slogan + mono 小字（不放长链接，避免溢出）
  x.fillStyle='#C46B4E';x.font='600 34px "Songti SC","STSong","SimSun",serif';x.textAlign='center';x.fillText('把此歌唱成一场五月天',W/2,H-104);
  x.fillStyle='#A3948A';x.font='400 18px "SF Mono",Menlo,monospace';x.fillText('MAYDAY CITY VINYL · 完整版见笔记正文',W/2,H-62);
  const dataUrl=c.toDataURL('image/png');const mt=window.xhs&&window.xhs.miniTool;
  if(mt&&mt.writeTempFile&&mt.saveImageToPhotosAlbum){mt.writeTempFile({data:dataUrl}).then(r=>mt.saveImageToPhotosAlbum({filePath:r.filePath})).then(()=>{$('saveCardBtn').textContent='已存到相册 ✓';setTimeout(()=>$('saveCardBtn').textContent='保存分享图到相册',1800)}).catch(()=>showCardPreview(dataUrl))}else{showCardPreview(dataUrl)}
}
function showCardPreview(dataUrl){const im=$('sheetImg');im.src=dataUrl;im.style.display='block';$('sheetHint').textContent='长按上方图片可以保存；在手机上会直接存入相册';showToast('长按这张卡片可以保存')}


/* ===== 11.5 免费文字生音乐：ACE-Step 1.5（浏览器直连） =====
   免费流程：歌词/叙事 + 音乐描述 -> ACE-Step 1.5 -> MP3。
   不再依赖本地代理；CORS 已验证（2026-08-26）：HF Space 对网页 Origin 开放。
   来源：https://huggingface.co/docs/hub/spaces-api-endpoints */
const ACE_HOST='ace-step-ace-step.hf.space';
// 免费账号认证额度：约 5 分钟 GPU/天，队列优先。比赛期内嵌，若额度被耗尽换新免费账号 token 替换此行即可。
const HF_TOKEN='';
let musicProviderReady=false;
function aceAuth(extra={}){return {...(HF_TOKEN?{Authorization:`Bearer ${HF_TOKEN}`}:{}),...extra}}

/* ===== 免费额度账本：分享唱片拿免费额度，用额度换生成 ===== */
const CREDIT_KEY='mayday_credits';
const CREDIT_MAX=10;
let credits=(()=>{try{const c=JSON.parse(localStorage.getItem(CREDIT_KEY));if(c&&Number.isFinite(c.n))return c}catch{}return null})();
if(!credits){credits={n:3,earned:0,lastShareClaim:0};localStorage.setItem(CREDIT_KEY,JSON.stringify(credits))}
function saveCredits(){localStorage.setItem(CREDIT_KEY,JSON.stringify(credits))}
function renderCreditBadge(){const el=$('creditBadge');if(el)el.textContent=`免费额度 ${credits.n}`}
function spendCredit(){if(credits.n<=0)return false;credits.n-=1;saveCredits();renderCreditBadge();return true}
function refundCredit(){if(credits.n<CREDIT_MAX){credits.n+=1;saveCredits();renderCreditBadge()}}
function claimShareCredit(){
  const now=Date.now();
  if(credits.n>=CREDIT_MAX){showToast('额度已满，先去刻一张唱片吧');return}
  if(now-(credits.lastShareClaim||0)<3*60*1000){showToast('刚刚已经领过一次了，再分享给一位新朋友吧');return}
  credits.n+=1;credits.earned=(credits.earned||0)+1;credits.lastShareClaim=now;
  saveCredits();renderCreditBadge();
  const el=$('claimShareBtn');if(el){el.disabled=true;el.querySelector('span').textContent='已领取 · 谢谢分享'}
  showToast('＋1 免费额度到手，去刻下一张唱片');
}
function setMusicStatus(text,state=''){
  const box=$('musicStatus'),label=$('musicStatusText');
  if(!box||!label)return;
  label.textContent=text;
  box.classList.remove('is-loading','is-ready','is-error');
  if(state)box.classList.add(`is-${state}`);
}
function recordLyricsForMusic(rec){
  return rec.sections.map((section,index)=>{
    const tag=section.label.includes('主歌')?`[Verse ${index}]`:section.label.includes('副歌')?'[Chorus]':'[Bridge]';
    return `${tag}\n${section.lines.join('\n')}`;
  }).join('\n\n');
}
function musicInputForRecord(rec){
  const song=songOf(rec.songId);
  return {
    title:rec.title,
    city:rec.city,
    mood:rec.mood,
    thesis:rec.thesis,
    style:`${STYLE_META[rec.style]?.label||'indie pop'}, Mandarin city pop, ${song?.theme||'narrative pop'}`,
    lyrics:recordLyricsForMusic(rec),
  };
}
function musicPromptFor(input){
  const style=String(input.style||'indie pop').slice(0,300);
  const mood=String(input.mood||'warm and reflective').slice(0,160);
  const city=String(input.city||'a city at night').slice(0,120);
  const thesis=String(input.thesis||'').slice(0,400);
  return [
    `${style}, Mandarin Chinese vocal, clear female lead vocal, warm live-band production.`,
    `A city-pop song about ${city}. Emotional center: ${mood}. Story: ${thesis}`,
    'Melodic bass, electric guitar, restrained synth texture, human dynamics, a memorable chorus lift.',
    'Do not imitate or reference any named artist or copyrighted song.',
  ].join(' ');
}
function normalizeLyrics(input){
  return String(input.lyrics||'')
    .replace(/\[Verse\s*\d*\]/gi,'[verse]')
    .replace(/\[Chorus\]/gi,'[chorus]')
    .replace(/\[Bridge\]/gi,'[bridge]')
    .replace(/\[Outro\]/gi,'[outro]')
    .slice(0,8000);
}
async function aceCallGradio(endpoint,data,timeoutMs){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs||240000);
  try{
    const submit=await fetch(`https://${ACE_HOST}/gradio_api/call/${endpoint}`,{
      method:'POST',signal:controller.signal,
      headers:aceAuth({'Content-Type':'application/json'}),
      body:JSON.stringify({data}),
    });
    if(!submit.ok)throw new Error(`submit_http_${submit.status}`);
    const {event_id:eventId}=await submit.json();
    if(!eventId)throw new Error('no_event_id');
    const result=await fetch(`https://${ACE_HOST}/gradio_api/call/${endpoint}/${eventId}`,{
      signal:controller.signal,headers:aceAuth({Accept:'text/event-stream'}),
    });
    if(!result.ok)throw new Error(`poll_http_${result.status}`);
    const text=await result.text();
    const events=text.split(/\r?\n\r?\n/).map(block=>({
      event:block.match(/^event:\s*(.+)$/m)?.[1]?.trim(),
      data:block.match(/^data:\s*([\s\S]+)$/m)?.[1]?.trim(),
    }));
    const complete=events.find(item=>item.event==='complete');
    if(complete?.data)return JSON.parse(complete.data);
    throw new Error('zero_gpu_error');
  }finally{clearTimeout(timer)}
}
async function checkMusicProvider(){
  try{
    const response=await fetch(`https://${ACE_HOST}/gradio_api/info`,{headers:aceAuth()});
    musicProviderReady=response.ok;
    if(musicProviderReady)setMusicStatus('免费 ACE-Step 1.5 已就绪 · 播放时生成真实歌曲','ready');
    else setMusicStatus('免费音乐引擎暂不可用 · 公共队列未响应','error');
  }catch{
    musicProviderReady=false;
    setMusicStatus('网络连不上音乐引擎 · 换个网络环境再试','error');
  }
}
async function requestOfficialSong(){
  if(!record)return;
  if(credits.n<=0){
    setMusicStatus('免费额度用完了 · 把这张唱片分享给朋友，可领 +1 额度','error');
    showToast('分享给朋友可以领免费额度');
    openShare();
    return;
  }
  if(!musicProviderReady){
    await checkMusicProvider();
    if(!musicProviderReady){showToast('免费音乐引擎还没有响应');return}
  }
  setMusicStatus('正在把歌词与生活片段送入免费 ACE-Step 1.5……（约需一至三分钟）','loading');
  spendCredit();
  try{
    const input=musicInputForRecord(record);
    const duration=Math.max(10,Math.min(120,60));
    const data=[
      duration,musicPromptFor(input),normalizeLyrics(input),
      8,7,'euler','apg',10,null,0.5,0,3,
      true,false,true,null,0,0,false,0.5,null,'none',
    ];
    const output=await aceCallGradio('__call__',data);
    const audioFile=Array.isArray(output)?output[0]:null;
    const audioUrl=audioFile?.url||(audioFile?.path?`https://${ACE_HOST}/gradio_api/file=${audioFile.path}`:null);
    if(!audioUrl)throw new Error('no_audio_file');
    const audioResponse=await fetch(audioUrl,{headers:aceAuth()});
    if(!audioResponse.ok)throw new Error(`audio_http_${audioResponse.status}`);
    const blob=await audioResponse.blob();
    if(blob.size<10*1024)throw new Error('audio_too_small');
    record.generatedMusicUrl=audioUrl;
    saveShelf();
    const player=$('generatedAudio');
    player.src=URL.createObjectURL(blob);
    player.load();
    setMusicStatus('真实歌曲已生成 · 由歌词与音乐描述驱动（免费开源模型）','ready');
    await player.play();
  }catch(error){
    refundCredit();
    const hint=String(error.message||'').includes('zero_gpu_error')?'免费 GPU 额度暂时用完或排队中，过一会儿再试':`生成失败：${error.message}`;
    setMusicStatus(hint,'error');
    showToast('生成失败，额度已退回，稍后再试');
  }
}
function bindGeneratedAudio(){
  const player=$('generatedAudio');
  if(!player)return;
  player.addEventListener('play',()=>{playing=true;document.body.classList.add('playing')});
  player.addEventListener('pause',()=>{playing=false;document.body.classList.remove('playing')});
  player.addEventListener('ended',()=>{playing=false;document.body.classList.remove('playing')});
}
function playRecord(){
  if(!record)return;
  const player=$('generatedAudio');
  if(player.src){
    if(player.paused)player.play().catch(()=>showToast('浏览器阻止了播放，请再点一次'));
    else player.pause();
    return;
  }
  requestOfficialSong();
}
function toggle(){playRecord()}
function stopPlayback(){
  playing=false;timers.forEach(clearTimeout);timers=[];document.body.classList.remove('playing');
  const player=$('generatedAudio');
  if(player){player.pause();player.currentTime=0}
  if(audio&&audio.state==='running')audio.suspend();
}

/* ===== 12. 事件绑定 ===== */
$('mainBtn').addEventListener('click',()=>{picked.length>=3?engrave():drawOne()});
$('playBtn').addEventListener('click',playRecord);
$('playerBtn').addEventListener('click',toggle);
$('remixBtn').addEventListener('click',remix);
$('shareBtn').addEventListener('click',openShare);
$('againBtn').addEventListener('click',startOver);
const swapDrawBtn=$('swapDrawBtn');
if(swapDrawBtn)swapDrawBtn.addEventListener('click',()=>{
  if(picked.length&&!record){removeFrag(picked[picked.length-1])}else{drawOne()}
});
const go=(id,name)=>{const el=$(id);if(el)el.addEventListener('click',()=>showScreen(name))};
go('goDrawBtn','Draw');go('goLiveBtn','Live');go('tabHome','Home');go('tabDraw','Draw');go('tabLive','Live');go('drawBackBtn','Home');go('liveBackBtn','Home');
const closeSongBtn=$('closeSongBtn');
if(closeSongBtn)closeSongBtn.addEventListener('click',()=>{stopPlayback();showScreen('Home')});
const loopSongBtn=$('loopSongBtn');
if(loopSongBtn)loopSongBtn.addEventListener('click',remix);
$('sheetClose').addEventListener('click',closeSheet);
$('sheetMask').addEventListener('click',closeSheet);
$('saveCardBtn').addEventListener('click',saveCard);
$('copyLinkBtn').addEventListener('click',()=>{
  if(navigator.clipboard&&shareUrl){
    navigator.clipboard.writeText(shareUrl).then(()=>showToast('链接已复制')).catch(()=>showToast('复制失败，长按链接试试'));
  }else showToast('长按下方链接即可拷贝');
});
$('claimShareBtn').addEventListener('click',claimShareCredit);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('shareSheet').classList.contains('open'))closeSheet()});

/* ===== 13. 初始化 ===== */
function init(){renderFlow(false);renderShelf();syncPlayer();bindGeneratedAudio();renderCreditBadge();checkMusicProvider()}
loadShelf();init();
