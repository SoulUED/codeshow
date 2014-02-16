/**
 * Created by Soul on 14-2-15.
 */

(function (exports) {
    function rule_parsing (that) {

        var rule_rex = /\s*([a-zA-Z0-9]*)([\.\#]*[a-zA-Z0-9\.\_\-\#]*)\[*([^\]\+>]*)\]*{*([^}\+>]*)}*\s*([>\+]*)/,
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
            code_location["deep0"] = [];
            code_location["deep0"].push(arr[0]);

            for (var i = 0,length = arr.length;i < length;i += 1) {
                if (arr[i].eleLocation === ">") {
                    code_location["deep" + (i + 1)] = [];
                    code_location["deep" + (i + 1)].push(arr[i + 1])
                }else if(arr[i].eleLocation === "+"){
                    code_location["deep" + i].push(arr[i+1]);
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
                return Boolean(value)?' ' + att +'=' + '"'+ value + '"' + ' ':'';
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
                        + " "
                        + getClassIdText(temporary_text.className,"class")
                        + getClassIdText(temporary_text.id,"id")
                        + temporary_obj[k].eleAttribute
                        + (ele_name === "input" || ele_name === "img" ? "/>" :">");

                    if (!(ele_name === "input" || ele_name === "img")){
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

            which_ele.appendChild(framework);
        }

    }

    rule_parsing(document.body)('div.class[type="text"] > input.text[type="text"] + div.text');
    rule_parsing(document.body)('div.class[type="text"] > input.text[type="text"] + div.text');
    exports.mv_code = rule_parsing;
})(window);




