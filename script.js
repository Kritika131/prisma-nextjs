import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient({log:["query"]})
//Note -- to know what going on inside prisma we log it based on query

const prisma = new PrismaClient()

//Whenever we create new PrismaClient, this actually manages different connections for you, so few dbs supports up to like five concurrent connections, this prisma client handle all five those connections for you ,so its really important you only use one instance of these prisma client , you don't create bunch of them otherwise you could bug down your database with too many connections

// prisma.user.findFirst()

async function main(){
  //--you will write your Prisma client queris here
  // const user = await prisma.user.create({data:{name:"qwerty"}})
  await prisma.user.deleteMany();
  // const user = await prisma.user.create({
  //   data:{
  //      name:"abc",
  //      email:"abc@gmail.com",

  //      userPreference:{
  //        create:{
  //         emailUpdates:true,
  //        },
  //      },

  //   },
  //   //to include userPreference we write --
  //   // include:{
  //   //   userPreference:true,
  //   // }

  //   //we also use select to choose or print specific field
  //   select:{
  //     name:true,
  //     // userPreference:true,
  //     //OR
  //     userPreference:{select:{id:true}}, // it will return only id
  //   }
  //   //it will return name and all userPreferences
  // })
  const user = await prisma.user.createMany({
    data: [
      {
        name: "abc",
        email: "abc@gmail.com",
      },
      {
        name: "abcde",
        email: "abcde@gmail.com",
      },
    ],

    //NOTE --> we can't use "select" in createMany
  });
  // console.log(user);

  //findUnique--> find value based on unique key and also we can pass "select" or "include" same as previous. it returns only single object. By using findUnique we only search by unique value not with other normal value.

  const finduser = await prisma.user.findUnique({
    where: {
      email: "abcde@gmail.com",
      //if we define unique key as--|@@unique([age,name])| then we find it like this--
      //age_name:{
      //age:20,
      //name:"abcd"
      //}
    },
  });

  //findFirst-->return first matched value. it is same as findUnique but allows you to find with any value.
  //findMany-->find many users with matches the query.it return array.
  const userr = await prisma.user.findFirst({
    where: {
      name: "abcde",
      // ||OR
      // name:{equals:"abcde"}
      //--both are
      // name:{not:"abcde"}
      // "not" is same as not equals . it return those value which not is not same as abcde
      //"in"--> it return all the user which name is same as given this array
      // name:{in:["abc","abcde"]},
      // name:{notIn:["abc","abcde"]},

      //"lt" ->less then
      //"gt" ->greater then
      //"gte"->greater then equal to
      //"lte"->less then equal to
      //eg --> age:{lt:20} -->return age is less than 20

      //"contains" --> contains allow us to check a text is contained inside of another piece of text
      //eg:-
      //  where:{
      //   email:{contains:"@test.com"}, // it return all the result which contain "@test.com" inside the email field.
      //  }
      //"endsWith"->string is ends with -->email:{endsWith:"@test1.com"},
      //"startsWith" -->string starts with that text. eg--> email:{startsWith:"abc"}
    },

    //NOTE-->"AND"--> we also combine more then one query using AND and OR
    // ----.findMany({
    //   where :{
    //     AND:[
    //       {email:{startsWith:"abc"}},
    //       {name:"abcde"}
    //     ]
    //   }
    //   if both query true this will return result.
    // })
    //OR--> it return if only one condition is true
    //NOT-> if condition is not equal to condition. eg-> where {NOT:{email:{startsWith:"abc"}}}
  });
  // console.log(userr.length);
  const userrr = await prisma.user.findMany({
    where: {
      name: "abcde",
    },
    distinct: ["name"], //if name is distinct it return that result
    //  distinct:["name","age"] //if name and age both are unique it return that result
  });
  const userrrr = await prisma.user.findMany({
    where: {
      name: "abcde",
    },
    //NOTE:- "orderBy" use for sorting purpose. it order age in ascending order
    // orderBy:{
    //   age:"asc",
    // age:"desc",
    // }

    //NOTE:- Both take and skip are to for apply pagination functionality.

    take: 2, //this return only two users not all, it basically apply limit.
    skip: 1, //skiping the first user.
  });
  //--------> Queries on relationships------------------>

  const user2 = await prisma.user.findMany({
    where: {
      userPreference: {
        emailUpdates: true,
      },
      //-->return all result where emailUpdates is true in userPreference

      //--Note-> if we wanted to do query on something that more then one-to-one query, we can actually do that by using--> every, none,some

      //where:{
      //writtenPosts:{
      //-->"every" writtenPost have this query
      //-->"some" any of the writtenPost have title="Test"
      //every:{
      //title:"Test",
      //title:{startsWith:"test"} || we do all queries which we do above.
      //     }
      //   }
      // }
    },
  });

  //---> find the author whose age=27 and it return all the post where author has age 27
  const author = await prisma.post.findMany({
    where: {
      author: {
        is: {
          age: 27,
        },
        // isNot:{}-->not equal to
      },
    },
  });

  // ----------------------UPDATES METHOD-------------------

  const userUpdate = await prisma.user.update({
    //where->provide condition
    where: {
      email: "abc@gmail.com",
    },
    //data here which you want to update
    data: {
      email: "qwerty@gmail.com",
    },
    //We can also use "select" and "include" just like previous one
  });

  console.log(userUpdate);

  //"updateMany" is also same as "update" but it update all the matches

  const userUp = await prisma.user.updateMany({
    where: {
      name: "abc",
    },
    data: {
      name: "abcd",
    },
    //NOTE-->it does'nt allow you to "select" or "include"
  });

  // update age by 1 where email="abc@gmail.com"
  /*
  const user = await prisma.user.update({
    where:{
      email:"abc@gmail.com"  || we just do this by only unique fields
    },
    data:{
      age:{
        increment:1,
        // decrement:1,
        //multiply:10
        //divide:10
      },
    },
    //---> create the userPreference where email is "abc@gmail.com"
    data:{
      userPreference:{
        //-NOTE-> what happens if we already have userpreference setted, so we connect this instead of creating 
        create:{
          emailUpdates:true 
          //--other fields as well if any
          
        }
        ---X--
        connect:{
          id:"jljfdf",
        }
        //--to disconnect the user with this id we use "disconnect"
        disconnect:true //since this is one to one relationship
      }
    }
  //NOTE--> we can also use connect and disconnet with "create" method as well

  })
  //-NOTE-> what happens if we already have userpreference setted, so we connect this instead of creating 

  const preference  = await prisma.userPreference.create({
    data:{
      emailUpdates:true
    }
  })


*/

// -------- Delete Method----
//delete one user based on unique field
 /*
   const user= await prisma.user.delete({
    where:{
      email:"abc@gmail.com"
    }
   })
  */
 //delete all user where age is greater than 20
 /* 
 const user = await prisma.user.deleteMany({
  where:{
    age:{gt:20}
  }
 })
 */
//To delete everything we pass nothing
/*
  const user = await prisma.user.deleteMany()
*/
} 

main()
  .catch(e=>{
    console.log(e.message);
  })
  .finally(async()=>{
    await prisma.$disconnect()
  })