export function resetNavigation(path: string, navigation: any) {
    navigation.reset({
        index: 0,
        routes: [
            {
                name: path
            }
        ]
    })
}