"Explorer" === BrowserDetect.browser &&
	9 > BrowserDetect.version && (Array.prototype
		.indexOf = function (a, c)
		{
			for (var b = c || 0, d = this.length; b <
				d; b++)
				if (this[b] === a) return b;
			return -1
		});
Element.prototype.getElementWidth =
	function ()
	{
		return "undefined" !== typeof this.clip ?
			this.clip.width : this.style.pixelWidth ?
			this.style.pixelWidth : this.offsetWidth
};
Element.prototype.getElementHeight =
	function ()
	{
		return "undefined" !== typeof this.clip ?
			this.clip.height : this.style.pixelHeight ?
			this.style.pixelHeight : this.offsetheight
};
Element.prototype.setOpacity = function (
	a)
{
	console.log("setOpacity", a, this);
	"Explorer" === BrowserDetect.browser &&
		8 == BrowserDetect.version ? this.style
		.filter =
		"progid:DXImageTransform.Microsoft.Alpha(Opacity=" +
		100 * a + ")" : this.style.opacity =
		a
};
Element.prototype.empty = function ()
{
	for (; this.hasChildNodes();) this.removeChild(
		this.lastChild);
	this.innerHTML = ""
};