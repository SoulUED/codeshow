/**
 * Created by Soul on 14-2-15.
 */

(function (exports) {
    function rule_parsing (that) {

        var rule_rex = /\s*([a-zA-Z0-9]*)([\.\#]*[a-zA-Z0-9\.\_\-\#]*)\[*([^\]\+>{}\s\^]*)\]*{*([^}\+>\^]*)}*\s*([>\+\^]*)/,
            pause_string,
            code_array = [],
            index = 0,
            code_location = {},
            which_ele= that;

        return function parsing(code_string){
            if (!code_string) {
                parsing_arr(code_array);

                return;
            }

            pause_string = code_string.match(rule_rex);
            console.log(pause_string);
            code_array.push({});
            code_array[index].eleName = pause_string[1];
            code_array[index].eleClassId = pause_string[2];
            code_array[index].eleAttribute = pause_string[3];
            code_array[index].eleText = pause_string[4];
            code_array[index].eleLocation = pause_string[5];
            index+=1;
            pause_string = pause_string[0];
            pause_string = code_string.replace(pause_string,"").replace(/\s*/,"");
            parsing(pause_string);
        }

        function parsing_arr(arr){
            var k = 0;
            code_location["deep0"] = [];
            code_location["deep0"].push(arr[k]);

            for (var i = 0,length = arr.length;i < length;i += 1) {
                if (arr[i].eleLocation === ">") {
                    code_location["deep" + (k + 1)] = [];
                    code_location["deep" + (k + 1)].push(arr[i+1]);
                    k+=1;
                }else if(arr[i].eleLocation === "+"){
                    code_location["deep" + k].push(arr[i+1]);
                }else if(arr[i].eleLocation === "^") {
                    code_location["deep" + (k -1)].push(arr[i+1])
                }
            }
            create_ele(code_location);

        }


        function create_ele (code_location) {
            var span_ele,
                d = document,
                temporary_obj,
                temporary_text,
                temporary_arr = [],
                folding,
                folding_arr = [],
                ele_name,
                framework = d.createDocumentFragment();

            function get_class (icString) {
                var spl_rex = /([\.#])([a-zA-Z0-9\-\_]*)/,
                    icString = icString,
                    icObject = {
                        id : [],
                        className : []
                    },
                    record;

                get(icString);

                icObject.id = icObject.id.join(" ");
                icObject.className = icObject.className.join(" ");

                return icObject;

                function get (Code) {

                    if (!Code) return;

                    record = Code.match(spl_rex);

                    if (record[1] === ".") {
                        icObject.className.push(record[2])
                    }else{
                        icObject.id.push(record[2]);
                    }
                    record = Code.replace(record[0],"");

                    get (record);
                }
            }

            function getClassIdText (value,att) {
                return Boolean(value)?' ' + att +'=' + '"'+ value + '"':'';
            }

            for (var i in code_location) {
                temporary_obj = code_location[i];
                for (var k = 0,length = temporary_obj.length;k < length;k += 1) {
                    span_ele = d.createElement("span");
                    folding = " ml" + i;
                    ele_name = temporary_obj[k].eleName;
                    span_ele.className = "mv-tag" + folding;
                    temporary_text = get_class(temporary_obj[k].eleClassId);
                    span_ele.innerText = "<" + ele_name
                        + getClassIdText(temporary_text.className,"class")
                        + getClassIdText(temporary_text.id,"id")
                        + (temporary_obj[k].eleAttribute ? " "+ temporary_obj[k].eleAttribute : "")
                        + (ele_name === "input" || ele_name === "img" ? " />" :">")
                        + temporary_obj[k].eleText + (!(ele_name === "input" || ele_name === "img") && (temporary_obj[k].eleLocation === "+" || temporary_obj[k].eleLocation === "")?"</" + ele_name + ">":"");

                    if (!(ele_name === "input" || ele_name === "img") && !(temporary_obj[k].eleLocation === "+" || temporary_obj[k].eleLocation === "") ){
                        temporary_arr.push(temporary_obj[k].eleName);
                        folding_arr.push(folding);
                    }

                    framework.appendChild(span_ele);
                }
            }

            for (var length = temporary_arr.length, i = length - 1; i > - 1 ;i -= 1) {
                span_ele = d.createElement("span");
                span_ele.className = "mv-tag" + folding_arr[i];
                span_ele.innerText = "</" + temporary_arr[i] + ">";
                framework.appendChild(span_ele);
            }
            if (which_ele) {
                which_ele.appendChild(framework);
            }else{
                return framework;
            }
        }

    }

    exports.mv_code = rule_parsing;
})(window);

mv_code(document.body)("div.text1 + div.text6 > div.text2 + div.text4 > div.text5");

/*
mv_code($("#radio-btn")[0])('input[type="radio"] + input[type="radio checked="checked"]');
mv_code($("#check-btn")[0])('input[type="checkbox"] + input[type="checkbox checked="checked"]');
mv_code($("#list-box")[0])("div.mv-list-box{办公用品} > span");
mv_code($("#drop-list")[0])('select.mv-drop-list > option[value="下拉框"]{下拉框}');
mv_code($("#textarea")[0])('textarea.mv-textarea');
mv_code($("#text-input")[0])('input.mv-text[type="text"] + input.mv-text[type="text" placeholder="提示性文字"] + input.mv-text[type="text" placeholder="密码框"]');
mv_code($("#button-html-small")[0])('input.mv-input-btn-small[type="button"] + input.mv-input-btn-common-small[type="button"]');
mv_code($("#button-html-middle")[0])('input.mv-input-btn-middle[type="button"] + input.mv-input-btn-common-middle[type="button"]');
mv_code($("#button-html-fun")[0])('input.mv-input-btn-fun[type="button"] + input.mv-input-btn-set-group[type="button"] + input.mv-input-btn-add-group[type="button"]');
mv_code($("#button-html-large")[0])('input.mv-input-btn-large[type="button"] + input.mv-input-btn-large-middle[type="button"] + input.mv-input-btn-large-max[type="button"]');
mv_code($("#message-notify")[0])('div.mv-notify-danger > span');
mv_code($("#text-validate")[0])('div.mv-text-danger > input.mv-input-text[type="text"] + span.mv-validate-icon + span.mv-danger-text');
mv_code($("#location-nav")[0])('p.mv-location-nav > span.mv-location-icon + a[href="#"]{推广计划列表} + a[href="#"]{dsp多标签测试} + span{流量估计}');
mv_code($("#page-show")[0])('div.mv-tab{推广效果总览} + div.mv-tab-similarity{推广效果总览}');
mv_code($("#message-box")[0])('div.mv-message-box > div.mv-message-box-head + div.mv-message-box-content');
mv_code($("#message-box")[0])('div.mv-message-box-common > div.mv-message-box-head + div.mv-message-box-content');
mv_code($("#load-state")[0])('div.mv-load-state > div.mv-load-ing > p{数据加载中} + div.mv-load > div.mv-load-style');*/
