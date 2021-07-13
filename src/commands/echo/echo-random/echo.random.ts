import axios from 'axios';
import { AppCommand, AppFunc, BaseSession } from '../../..';

class EchoRandom extends AppCommand {
    trigger = 'random';
    func: AppFunc<BaseSession> = async (session) => {
        let words = '';
        // axios
        //     .get('https://jsonplaceholder.typicode.com/users')
        //     .then((res) => {
        //         const headerDate =
        //             res.headers && res.headers.date
        //                 ? res.headers.date
        //                 : 'no response date';
        //         console.log('Status Code:', res.status);
        //         console.log('Date in Response header:', headerDate);

        //         const users = res.data;

        //         users.forEach((user: any) => {
        //             console.log(
        //                 `Got user with id: ${user.id}, name: ${user.name}`
        //             );
        //         });
        //     })
        //     .catch((err) => {
        //         console.log('Error: ', err.message);
        //     });

        axios
            .get('https://api.ixiaowai.cn/api/ylapi.php', {
                headers: {
                    Accept: 'text/html,application/xhtml+xml,application/xml',
                },
            })
            .then((res) => {
                const headerDate =
                    res.headers && res.headers.date
                        ? res.headers.date
                        : 'no response date';
                console.log('Status Code:', res.status);
                console.log('Date in Response header:', headerDate);
                console.log(res);
                words = res.data;
                console.log(words);
            })
            .catch((err) => {
                words = err;
                console.log(words);
            });

        return session.quote(words);
    };
}

export const echoRandom = new EchoRandom();
