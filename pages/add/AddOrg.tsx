import { useEffect, useState } from "react";
import Link from "next/link";
import TraitTab from "./TraitTab";
import cx from "classnames";
import { images } from "../../public/image-data.json";
import { ImageData } from '@nouns/assets';
type AddOrgsProps = {
  setRequestSeed: Function;
}
const orgs = [
  {
    "title": "Audubon Society",
    "description": "The Audubon Society protects birds and the places they need, today and tomorrow, throughout the Americas using science, advocacy, education, and on-the-ground conservation.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x12345"
  }, 
  {
    "title": "The Nature Conservancy",
    "description": "The Nature Conservancy is a global conservation organization. We have been protecting nature for the benefit of all for more than 60 years. We work in all 50 United States and in more than 30 countries. We use science, policy, partnerships and field projects to conserve the lands and waters on which all life depends.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x54321"
  }, 
  {
    "title": "Sierra Club",
    "description": "The Sierra Club is the nation's oldest and largest grassroots environmental organization. We work to protect communities, wild places, and the planet itself.",
    "image": "https://placeimg.com/320/320/nature",
    "address": "0x00000"
  }
]
const AddOrgs = (props: AddOrgsProps) => {
  const [amount, setAmount] = useState<string>("0");

  return (
    <div className="">
      <div>
        <h3>Quick overview</h3>
        <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
      </div>
      <div>
        <div>
          <h3 className="text-xl font-bold">
              Amount
          </h3>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="text" 
            placeholder={`0.1 eth`}
            value={amount}
            onChange={event => setAmount(event.target.value)}
          />
        </div>
        <div>
          <h3 className="text-xl font-bold">
            Nonprofits
          </h3>
          <div className="flex flex-col gap-10">
            {orgs.map((org, i) => {
              return (
                <div className="flex gap-5">
                  <img src={org.image} alt="" className="w-20 h-20 rounded" />
                  <div>
                    <h4 className="text-lg font-bold">
                      {org.title}
                    </h4>
                    <p>
                      {org.description}
                    </p>
                  </div>
                  <div>
                    <button 
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => props.setRequestSeed(request => ({ traitName: request.traitName, donation: { to: org.address, amount: amount }}))}
                    >
                      Select
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddOrgs;
