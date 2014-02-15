/**
 * Created by Soul on 14-2-15.
 */

(function (exports) {
    function rule_parsing (Code) {

        var rule_rex = /\s*([a-zA-Z0-9]*)([\.\#]*[a-zA-Z0-9\.\_\-\#]*)([\[*[^\]]*[\]]*]*)([{*[^}]*}*]*)\s*([>\+]*)/,
            pause_string,
            code_array = [],
            index = 0,
            code_location = {};

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
                    console.log(code_location);
                    code_location["deep" + i].push(arr[i+1]);
                }
            }

            console.log(code_location);

            return code_location;

        }
    }
    rule_parsing()("div.text#text > div.text1#text1 + div.text11#text11 > div.text2#text2 > div.text3#text3")
    exports.mv_code = rule_parsing;
})(window);

//([\[]*[^\]]*[\]]*)