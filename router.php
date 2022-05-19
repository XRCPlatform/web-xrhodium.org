<?php

class Router
{

    static public function parse($url, $request)
    {
		$url = ltrim(trim($url), '/');
        $explode_url = explode('/', $url);

		if (!empty($explode_url[0])) {	
			$explode_url[0] = strtolower(str_replace("-", "", $explode_url[0]));
					
			switch ($explode_url[0]) {			
		
				case "arae":
				case "arar":
				case "ar":
					$request->controller = "ar";
					break;
			
				case "cncn":
				case "cn":
				case "cnhk":
				case "cntw":
				case "cnzh":
				case "chgw":
					$request->controller = "cn";
					break;
			
				case "esbr":
				case "es":
				case "eses":
				case "espt":
				case "sp":
					$request->controller = "es";
					break;
			
				case "ru":
				case "rugw":
				case "ruru":
				case "ruua":
					$request->controller = "ru";
					break;
					
				default:
					$request->controller = "en";
					break;
			}
			
			if (empty($explode_url[1])) {
				$request->action = "index";
			} else {
				$request->action = strtolower($explode_url[1]);
			}
			if (!empty($explode_url[1]) && (strtolower($explode_url[1]) == "roadmap")) {
			   $request->controller = "en";	
			}
			$request->params = array_slice($explode_url, 2);
			
		} else {
	
			$request->controller = "en";

			if (empty($explode_url[1])) {
				$request->action = "index";
			} else {
				$request->action = strtolower($explode_url[1]);
			}
			$request->params = array_slice($explode_url, 2);
		}	
		
		$request->controller = ucfirst($request->controller);
    }
}
?>