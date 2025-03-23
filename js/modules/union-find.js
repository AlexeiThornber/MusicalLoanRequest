export class UnionFind{
    constructor(){
        this.parent = new Map();
    }

    find(x){
        //we set a default representative
        if(!this.parent.has(x)){
            this.parent.set(x, x);
        }

        if(this.parent.get(x) !== x){
            this.parent.set(x, this.find(this.parent.get(x)))
        }

        return this.parent.get(x)
    }

    union(x,y){
        const rootX = this.find(x);
        const rootY = this.find(y);

        if(rootX != rootY){
            this.parent.set(rootX, rootY);
        }
    }
}

const events2 = [
    [
        {
            id: "e1",
            start: 1,
            end: 3
        },
        {
            id : "e2",
            start: 1,
            end : 3
        },
    ],
    [
        {
            id: "e3",
            start: 6,
            end: 8
        },
        {
            id: "e4",
            start: 6,
            end: 10
        },
    ],
    [
        {
            id: "e4",
            start: 6,
            end: 10
        },
        {
            id: "e5",
            start: 9,
            end: 9
        },
        {
            id: "e6",
            start: 10,
            end: 17
        }
    ],
    [
        {
            id: "e7",
            start: 20,
            end: 22
        }
    ]
]