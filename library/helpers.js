export function access(res, roles, path, titleName, obj) {
    const { user } = res.locals;

    if (user) {
        const options = {
            title: titleName,
            name: user.fullName,
            role: user.role,
            ...obj
        }

        if (roles) {
            for(let role of roles) {
                if (user.role === role) return res.render(path, options);
            }

            return res.status(403).send('У вас нет прав к этой странице.');;
        }

        return res.render(path, options);
    } else {
        return res.redirect('/');
    }
}