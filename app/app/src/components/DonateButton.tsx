function DonateButton() {
    return (
        <form action="https://www.paypal.com/donate" method="post" target="_top">
            <input type="hidden" name="hosted_button_id" value="LA3SGLKW7N4U8" />
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" style={{ border: "0", width: "150px", height: "auto" }} name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
            <img alt="" style={{ border: "0" }} src="https://www.paypal.com/en_PT/i/scr/pixel.gif" width="1" height="1" />
        </form>

    );
}

export default DonateButton;
