<?php
class arController extends Controller
{
    function index()
    {
        $d['tasks'] = "test";
        $this->set($d);
        $this->render("index");
    }
	
	function roadmap()
    {
        $this->render("roadmap");
    }
	
	function cryptotrinity()
    {
        $this->render("cryptotrinity");
    }
	
	function stronghandsairdrop()
    {
        $this->render("stronghandsairdrop");
    }
	
	function freemarket()
    {
        $this->render("freemarket");
    }
	
	function ambassadorprogram()
    {
        $this->render("ambassadorprogram");
    }
	
	function sharingessentials()
    {
        $this->render("sharingessentials");
    }
	
	function community()
    {
        $this->render("community");
    }
}
?>