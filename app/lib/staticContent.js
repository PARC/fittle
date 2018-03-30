/**
 * Created by lnelson on 10/12/16.
 */
export const StaticContent = {
    defaultProfilePictureThumbnail,
    getNoInternetImage
};

function defaultProfilePictureThumbnail() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEDWlDQ1BJQ0MgUHJvZmlsZQAAOI2NVV1oHFUUPrtzZyMkzlNsNIV0qD8NJQ2TVjShtLp/3d02bpZJNtoi6GT27s6Yyc44M7v9oU9FUHwx6psUxL+3gCAo9Q/bPrQvlQol2tQgKD60+INQ6Ium65k7M5lpurHeZe58853vnnvuuWfvBei5qliWkRQBFpquLRcy4nOHj4g9K5CEh6AXBqFXUR0rXalMAjZPC3e1W99Dwntf2dXd/p+tt0YdFSBxH2Kz5qgLiI8B8KdVy3YBevqRHz/qWh72Yui3MUDEL3q44WPXw3M+fo1pZuQs4tOIBVVTaoiXEI/MxfhGDPsxsNZfoE1q66ro5aJim3XdoLFw72H+n23BaIXzbcOnz5mfPoTvYVz7KzUl5+FRxEuqkp9G/Ajia219thzg25abkRE/BpDc3pqvphHvRFys2weqvp+krbWKIX7nhDbzLOItiM8358pTwdirqpPFnMF2xLc1WvLyOwTAibpbmvHHcvttU57y5+XqNZrLe3lE/Pq8eUj2fXKfOe3pfOjzhJYtB/yll5SDFcSDiH+hRkH25+L+sdxKEAMZahrlSX8ukqMOWy/jXW2m6M9LDBc31B9LFuv6gVKg/0Szi3KAr1kGq1GMjU/aLbnq6/lRxc4XfJ98hTargX++DbMJBSiYMIe9Ck1YAxFkKEAG3xbYaKmDDgYyFK0UGYpfoWYXG+fAPPI6tJnNwb7ClP7IyF+D+bjOtCpkhz6CFrIa/I6sFtNl8auFXGMTP34sNwI/JhkgEtmDz14ySfaRcTIBInmKPE32kxyyE2Tv+thKbEVePDfW/byMM1Kmm0XdObS7oGD/MypMXFPXrCwOtoYjyyn7BV29/MZfsVzpLDdRtuIZnbpXzvlf+ev8MvYr/Gqk4H/kV/G3csdazLuyTMPsbFhzd1UabQbjFvDRmcWJxR3zcfHkVw9GfpbJmeev9F08WW8uDkaslwX6avlWGU6NRKz0g/SHtCy9J30o/ca9zX3Kfc19zn3BXQKRO8ud477hLnAfc1/G9mrzGlrfexZ5GLdn6ZZrrEohI2wVHhZywjbhUWEy8icMCGNCUdiBlq3r+xafL549HQ5jH+an+1y+LlYBifuxAvRN/lVVVOlwlCkdVm9NOL5BE4wkQ2SMlDZU97hX86EilU/lUmkQUztTE6mx1EEPh7OmdqBtAvv8HdWpbrJS6tJj3n0CWdM6busNzRV3S9KTYhqvNiqWmuroiKgYhshMjmhTh9ptWhsF7970j/SbMrsPE1suR5z7DMC+P/Hs+y7ijrQAlhyAgccjbhjPygfeBTjzhNqy28EdkUh8C+DU9+z2v/oyeH791OncxHOs5y2AtTc7nb/f73TWPkD/qwBnjX8BoJ98VVBg/m8AAAUCSURBVHgB7VrNjxRFFK/qWdZAZMnOznb1tMTEGycNhq/EgySi4R8gXDxpOHHExBgCiZhwIODRgybcOED4B4D4kaiJCuFDDt4kHpzp7mFcdyUsAaYfr8w26emuqq7qrp7tzc5cuqvee7/33q9e1XR3FSHT35SBKQObmQE6ieS7LvuJUvqOkS8gX/Si4LSRTQnl2gjwmQcl4hGbAPR6UfiaWFit1yoBvuu+T6hzvVpIauteGFiN2QrY3Nxc+9Wt24bq0O1KbRFRmQCrpW7KEUAfp4ZvapbWr0LAVkz+cRpsve6rVINTJmifsctNSZ7Hv1aFs2VyMa4A/EsL8C+NlXFWt82zePT2YDC4Y+LHiABMfhmTnzNxMGldUxK0pwCW/bdNT56TvcVp3caL9nTQqgB/YWEXmdnyx6RHs4o/3YVRrwI2WPKcON2/58IK0AXSHS3ZyHSZ9wMG864ujpaexnPCjAqILbKPVHITGRCI+mEo/ffoh8HBBM8a6ZR2E0zZVVkB1gIB+Bef2OZlQYj6sSIGGFxHJDPtk1Udx5GuAbjq/2LqSKZvmjzHwYpYlOHZ7JcSQAjdb8NRDPHxsjiqkTPBVFWykADPdU+YOFDpBlH0lUq+3jIhAQ51zq93YLb9+y77W4QpJECkuOH7KBW+NucI6C6yzzZ8sgYJ5AigDj1rYF+oynawNwqVJqTgu96ZrKscAVmFqu1wOXxQFcOaPSWnsli1E5B12LT2lID0iHgL3r50ezPcj1eAQ/baTlr1FFbkq4ptEXYiHyPAofGeRLBZrmMEAHG215G41/EOmuKWsTH1wfXHCKAAt8qAFNk4LfJ9kU5WXsYmi6HTHiNg5JCbOkZldLqdjvb08ha90m+QprHlPojUufDovt5OMoaxCjBlz1RfJzEdHVO/Kv2JEsAD4Qn68/OvZ4PCl7BvJp08j0H5UTQbZIX2EpZ/m9t3GXtAZ1/5C5PNwwH5FE+FnOOCOsgAgJ+zTvNrgMtuEEoPZRXLtmXzHrfZvsadpmMcF7ezduOe3l2RD5tEiGLJEcCDqOoUIP6wH0WXRAmV7cPPdKfxS9XnZe25Xe0EiBxUCVhiS3GAYolM2S2KT7wIAtxTImWEOLf+FIFn1Gw1oYwvmY1wCvBITaaBDNxWxjIcGzGKK0DmUdAPQK4JupvVBfEHsoCkBOiOaj8KDsvA6+6P49ERHR+9KLoh05MSwA3wpONDmWET+oPB4GpRHI9WHy+odJQEFO3P4eL3XAXeBNnKyso/qjiUBHBDnArbpACj529KZQ0Q6EzjQgIwj1UCcF+UT384XPdjM/jQJdzHVA5cKhkdAghubzd2pPGJ88tUPmu3cAVvVvP9+R4tAriZTjnl4Sffg+tS2AvDo7qetQnggE0nAZNf6Ueh4DVTTocRAQ0lYS0H+A6T3yFP1bIE99t/54+i7XZ7p2Vobbiu6/3IY/j/HKO2lV1FfmIcTJ7Jbbm35Vf6MmQSaOpE1xDXCSsnu2T+E7JHMXwcDsKLMj3dfisEJM6S4Hjb5oLZ6XT82dbM2hEX+BVX+QOJz6pXqwQkweD6cBc/q73F27gyw5NnT+eXlpaWE7nOlTF2qEXoy5cYPG32CR64uqBja6JTCwHpAJAM6TdGTg5+F5TGgKdLT+LpUqsnVtKx8Xup86yizTaO7nutmO4BSvZSEv8Xg3OLxORmMAx+s+lnijVlYMpAIQMvABpTiYuYjK6CAAAAAElFTkSuQmCC"
};



function getNoInternetImage() {
    return 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA3NTAgNjUzLjIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDc1MCA2NTMuMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNCRDU3MzQ7fQo8L3N0eWxlPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCg0LjQ5NDg3LDAsMCw0LjQ5NDg3LC0yNTUwLjU4LC0xNjcxLjE1KSI+Cgk8cGF0aCBkPSJNNjk0LDQzNC43TDY5NCw0MzQuN2MtMC41LTAuOC0xMi43LTIwLjItNDEuNy0yMC4yYy0yOSwwLTQxLjMsMTkuNC00MS44LDIwLjJsMCwwYy0wLjEsMC4yLTAuMywwLjUtMC4zLDAuOAoJCWMwLDAuNCwwLjIsMC44LDAuNCwxLjFsNC41LDQuNWMwLjMsMC4zLDAuNiwwLjQsMS4xLDAuNGMwLjUsMCwxLTAuMywxLjItMC43bDAsMGMwLjEtMC4yLDExLjgtMTcuMywzNC44LTE3LjMKCQljMjIuOSwwLDM0LjYsMTcuMiwzNC44LDE3LjNsMCwwYzAuMywwLjQsMC43LDAuNywxLjIsMC43YzAuNCwwLDAuOC0wLjIsMS4xLTAuNGw0LjUtNC41YzAuMy0wLjMsMC40LTAuNiwwLjQtMS4xCgkJQzY5NC4zLDQzNS4yLDY5NC4yLDQzNC45LDY5NCw0MzQuNyBNNjgyLDQ0Ni41Yy0wLjQtMC42LTExLjItMTQuMS0yOS43LTE0LjFjLTE4LjUsMC0yOS4yLDEzLjUtMjkuNywxNC4xbDAsMAoJCWMtMC4yLDAuMy0wLjMsMC42LTAuMywwLjljMCwwLjQsMC4yLDAuOCwwLjQsMS4xbDQuNSw0LjVjMC4zLDAuMywwLjYsMC40LDEuMSwwLjRjMC41LDAsMC45LTAuMywxLjItMC42bDAsMAoJCWMwLjEtMC4xLDguOC0xMS40LDIyLjgtMTEuNHMyMi43LDExLjMsMjIuOCwxMS40bDAsMGMwLjMsMC40LDAuNywwLjYsMS4yLDAuNmMwLjQsMCwwLjgtMC4yLDEuMS0wLjRsNC41LTQuNQoJCWMwLjMtMC4zLDAuNC0wLjYsMC40LTEuMUM2ODIuMyw0NDcuMSw2ODIuMSw0NDYuOCw2ODIsNDQ2LjVMNjgyLDQ0Ni41eiBNNjcwLDQ1OC41Yy0wLjMtMC4zLTYuNi04LjEtMTcuNy04LjFzLTE3LjQsNy43LTE3LjcsOC4xCgkJbDAsMGMtMC4yLDAuMy0wLjQsMC42LTAuNCwwLjljMCwwLjQsMC4yLDAuOCwwLjQsMS4xbDQuNSw0LjVjMC4zLDAuMywwLjYsMC40LDEuMSwwLjRjMC41LDAsMC45LTAuMywxLjItMC42bDAsMAoJCWMwLTAuMSw0LjItNS40LDEwLjgtNS40YzYuNiwwLDEwLjgsNS4zLDEwLjgsNS40bDAsMGMwLjMsMC40LDAuNywwLjYsMS4yLDAuNmMwLjQsMCwwLjgtMC4yLDEuMS0wLjRsNC41LTQuNQoJCWMwLjMtMC4zLDAuNC0wLjYsMC40LTEuMUM2NzAuMyw0NTkuMSw2NzAuMSw0NTguOCw2NzAsNDU4LjVMNjcwLDQ1OC41eiBNNjU4LjEsNDcwLjhjLTAuMS0wLjItMi0zLjgtNS44LTMuOHMtNS44LDMuNy01LjgsMy44bDAsMAoJCWMtMC4xLDAuMi0wLjIsMC40LTAuMiwwLjdjMCwwLjQsMC4yLDAuOCwwLjQsMS4xbDQuNSw0LjVjMC4zLDAuMywwLjYsMC40LDEuMSwwLjRzMC44LTAuMiwxLjEtMC40bDQuNS00LjUKCQljMC4zLTAuMywwLjQtMC42LDAuNC0xLjFDNjU4LjMsNDcxLjIsNjU4LjIsNDcxLDY1OC4xLDQ3MC44TDY1OC4xLDQ3MC44eiIvPgo8L2c+CjxnIHRyYW5zZm9ybT0ibWF0cml4KDE2LjA0ODEsMCwwLC0xOC4wMDY3LC03MDkxLjQ4LDE1NjIuNzUpIj4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NzMuNiw1OC4zbC05LjIsOS4ybC05LjQsOS40Ii8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDY1LDY4bDkuMi05LjJsLTEuMy0xbC05LjIsOS4ybC05LjQsOS40bDEuMywxTDQ2NSw2OHoiLz4KPC9nPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCgtMjIuNzI3MywwLDAsLTE5Ljc5MzIsMTA2MTQuNCwxNjg2Ljc2KSI+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDUwLjUsNTIuMmMtOS4xLDAtMTYuNSw3LjQtMTYuNSwxNi41czcuNCwxNi41LDE2LjUsMTYuNWM5LjEsMCwxNi41LTcuNCwxNi41LTE2LjVTNDU5LjYsNTIuMiw0NTAuNSw1Mi4yCgkJIE00NTAuNSw1OC4yYzUuOCwwLDEwLjUsNC43LDEwLjUsMTAuNXMtNC43LDEwLjUtMTAuNSwxMC41Yy01LjgsMC0xMC41LTQuNy0xMC41LTEwLjVTNDQ0LjcsNTguMiw0NTAuNSw1OC4yIi8+CjwvZz4KPC9zdmc+Cg=='


}

/*************************************************************************
 *
 *  © [2018] PARC Inc., A Xerox Company
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Xerox Corporation.
 * The intellectual and technical concepts contained
 * herein are proprietary to PARC Inc. and Xerox Corp.,
 * and may be covered by U.S. and Foreign Patents,
 * patents in process, and may be protected by copyright law.
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 *
 **************************************************************************/
