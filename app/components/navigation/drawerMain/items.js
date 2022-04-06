const setItem = (icon, text, route, style) => {
    return {icon, text, route, style};
};

const items = {
    links: [
    ],
    screens: [
        setItem("image", "Dashboard", "Dashboard"),
    ]
};

items.links.forEach((item, index) => (item.key = `drwil${index}`));
items.screens.forEach((item, index) => (item.key = `drwis${index}`));

export default items;
