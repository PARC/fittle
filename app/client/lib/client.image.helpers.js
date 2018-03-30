/**
 * Created by lnelson on 10/19/16.
 */

/**
 * Dictionary providing access to date related helpers.
 * Although this dictionary is unnecessary (because most functions and variables are also individually exported
 * via the 'export' statement), this convention makes clearer elsewhere in the code (i.e., in other files)
 * where the helper comes from. For example, the code will read ProfileHelper.getPicture() provides more info
 * than getPicture().
 */
export const ImageHelper = {
    'encodeImageData': encodeImageData,
    'readSingleImageAndProcessResult': readSingleImageAndProcessResult,
    resizeCanvas,
    resizeImageUri
};

/**
 * Create the display image as a Base64 string
 * @param imageData
 * @returns {string}
 */
export function encodeImageData(imageData) {
    return "data:image/png;base64," + btoa(imageData)
}

/**
 * Resize image from image uri
 * @param imgUrig
 * @param maxWidth
 * @param maxHeight
 */
function resizeImageUri(imgUri, maxWidth, maxHeight, cropIt, process_result) {
    var img = new Image();
    img.onload = function() {
        let newImg = resizeCanvas(img, maxWidth, maxHeight).toDataURL();
        if (cropIt) {
            var img2 = new Image();
            img2.onload = function() {
                process_result(cropCanvas(img2, maxWidth, maxHeight).toDataURL());
            }
            img2.src = newImg;
        } else {
            process_result(newImg);
        }
    };
    img.src = imgUri;
}

/**
 * Resize the image in inCanvas to the maxWidth & height args, and return the new canvas with image in it
 * @param img
 * @param maxWidth
 * @param maxHeight
 */
function resizeCanvas(img, maxWidth, maxHeight) {
    var canvasCopy = document.createElement("canvas");
    var copyContext = canvasCopy.getContext("2d");
    var ratio = 1;
    var ratioW = 1;
    var ratioH = 1;

    if(img.width > maxWidth) {
        ratioW = maxWidth / img.width;
    }
    if(img.height > maxHeight) {
        ratioH = maxHeight / img.height;
    }

    ratio = (maxWidth <= Meteor.settings.public.PROFILE_PIC_PIX) ? Math.max(ratioW, ratioH) : Math.min(ratioW, ratioH);
    canvasCopy.width = img.width * ratio;
    canvasCopy.height = img.height * ratio;
    console.log("Resize from " + img.width + " x " + img.height + " to " + canvasCopy.width + " x " +  canvasCopy.height
        + ", ratio: " + ratio + ", W: " + ratioW + ", H: " + ratioH);
    copyContext.drawImage(img, 0, 0, canvasCopy.width, canvasCopy.height);
    return canvasCopy;
}

/**
 * Crop the image in inCanvas to the width & height args (centered), and return the new canvas with image in it
 * @param img
 * @param maxWidth
 * @param maxHeight
 */
function cropCanvas(img, width, height) {
    var canvasCopy = document.createElement("canvas");
    var copyContext = canvasCopy.getContext("2d");
    var x = 0;
    var y = 0;

    if(img.width > width) {
        x = Math.floor((img.width - width) / 2);
    } else {
        width = img.width;
    }
    if(img.height > height) {
        y = Math.floor((img.height - height) / 2);
    } else {
        height = img.height;
    }
    canvasCopy.width = width;
    canvasCopy.height = height;
    console.log("Crop from (" + x + "," + y + ")  " + img.width + " x " + img.height + " to " + width + " x " +  height);
    copyContext.drawImage(img, x, y, width, height, 0, 0, width, height);
    return canvasCopy;
}

/**
 * Read an image file if necessary and create the post
 * @param f
 * @param who
 * @param text
 * @param topic
 */
export function readSingleImageAndProcessResult(f, process_result) {
    //Retrieve the first (and only!) File from the FileList object
    var img = new Image();
    img.onload = function() {
        process_result(
            resizeCanvas(img, Meteor.settings.public.IMAGE_POST_MAX_WIDTH, Meteor.settings.public.IMAGE_POST_MAX_HEIGHT).toDataURL(),
            resizeCanvas(img, Meteor.settings.public.IMAGE_ICON_WIDTH, Meteor.settings.public.IMAGE_ICON_HEIGHT).toDataURL());
    };
    img.src = f;
    return;
}

/*************************************************************************
 *
 * © [2018] PARC Inc., A Xerox Company
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
