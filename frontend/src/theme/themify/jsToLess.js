function jsToLess(source) {

    const lines = [];

    const pixelTypes = [
        'space',
        'border_radius',
        'dimension',
        'font_size',
    ];

    for (let type in source) {
        if (source.hasOwnProperty(type)) {
            if (!type.startsWith('$')) {
                lines.push(
                    '// ' + type.toUpperCase().split('_').join(' ')
                );

                for (let key in source[type]) {
                    if (source[type].hasOwnProperty(key)) {
                        let name = type.split('_').join('-') + '-' + key.split('_').join('-');
                        let val = source[type][key];

                        if (pixelTypes.includes(type)) {
                            val += 'px';
                        }

                        lines.push(
                            `@${name}: ${val};`
                        );
                    }
                }
            }

            if (type === '$color_interactive') {
                const mixins = source[type];
                const alias = type.substring(1);

                lines.push(
                    '// ' + alias.toUpperCase().split('_').join(' ') + ' *'
                );

                for (let key in mixins) {
                    if (mixins.hasOwnProperty(key)) {
                        let name = key.split('_').join('-');
                        let attr = key.split('_')[0];

                        lines.push(`.${name}(@color) {`);
                        lines.push(`    ${attr}: ${mixins[key]};`);
                        lines.push(`}`);
                    }
                }
            }

            lines.push('');
            lines.push('');
        }
    }


    return lines.join('\n');
}

module.exports = jsToLess;
