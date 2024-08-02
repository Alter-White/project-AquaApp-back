class UserDto {
    name;
    email;
    constructor(model) {
        this.name = model.name;
        this.email = model.email;
    }
}
export default UserDto;
