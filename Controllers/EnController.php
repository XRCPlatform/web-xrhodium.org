<?php
class enController extends Controller
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
	
	function roadmap2()
    {
        $this->render("roadmap2");
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