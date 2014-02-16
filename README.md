
UI,HTML代码生成
===================================

仅仅基于emmet + > 制作

通过js生成HTML嵌套标签,基于Emmet

＋ > 为关键字符说明元素之间的关系

+ 代表元素之间的关系为兄弟元素
> 代表元素之间的关系为后代关系

引入
<link rel="stylesheet" href="css/tag-product.css" />
<script type="text/javascript" src="javascripts/code-product.js"></script>


语法规则

元素名.类名#id名[属性 属性 属性]{文本信息} >（下级元素）+ (兄弟元素) 元素名.类名#id名[属性 属性 属性]{文本信息};

支持多类名

+ > 为特殊标示符号，说明元素之间的关系，若其他地方出现使用转义字符

div > div + div

div.text > div

div.text#id[data-value="example"] > div + div > div > input

目前标签嵌套暂停4层,若超出请在css中自行增加缩进距离

使用方法
-----------------------------------------

    mv_code(docunemt.body)("div.class[type="text"] > input.text[type="text"] + div.text");

    将生成的代码插入到body中
