# 内存签名与CE指南

内存签名是一种独一无二的二进制字符串，用于在程序运行中寻找其特定位置的内存地址。

找到这些签名后，即便游戏本身拒绝提供任何API，你也可以通过签名获取游戏状态。 (例如：是否处于战斗中，职业量谱的各种数值，仇恨数值的具体量等等)

这一篇指南旨在介绍如何使用CE(Cheat Engine)查找此类内存签名。 如果您了解一些基本的汇编语言或编程经验，并且有水滴石穿的耐心，那么这篇文章可能对您有一定的帮助。

## 目录

* [安装](#installation)
* [查找新的内存签名](#finding-new-memory-signatures)
  * [连接CE到游戏中](#connect-cheat-engine-to-the-game)
  * [初始内存搜索](#initial-memory-search)
  * [再次扫描](#repeated-scans)
  * [浏览内存](#browsing-memory)
  * [方法1：找出写内存的代码](#approach-1-finding-writers)
  * [方法2：跟踪](#approach-2-tracing)
  * [方法3：找出读内存的代码](#approach-3-finding-readers)
  * [汇编代码和指针](#assembly-code-and-pointers)
  * [从汇编代码中提取签名](#extracting-a-signature-from-assembly)
* [扫描现有的内存签名](#scan-for-existing-memory-signatures)

## 安装

安装最新版本的 [Cheat Engine](https://github.com/cheat-engine/cheat-engine/releases/latest)。 安装程序带了一些流氓软件，因此请确保不要勾选它们，不要盲目地一直“下一步”。 抱歉，  真的很流氓。

## 查找新的内存签名

![cheat engine screenshot](../../images/cheatengine_initial.png)

### 连接CE到游戏中

启动最终幻想14并登录。

然后，打开Cheat Engine。 点击 **文件**，选择 **打开进程**，然后选择最终幻想14的进程。

此时，顶部栏显示的应当是 **ffxiv_dx11.exe**。

![cheat engine connected screenshot](../../images/cheatengine_connected.png)

### 初始内存搜索

假设我们正在寻找您的角色在内存中的职业量谱。 为了简单起见，假设我们现在是一名战士，而我们正在寻找量谱中的兽魂值。 由于内存中存在许多零值，我们从一个非零值开始会简单一些。

在游戏中切换到战士职业，然后打几下木人，直到让你的兽魂值达到80。

切换到Cheat Engine。

![cheat engine initial scan screenshot](../../images/cheatengine_initialscan.png)

输入80的值（不要勾选十六进制）。 扫描类型应为 `精确值` ，数值类型应为 `4字节`。 此时，我们还不知道兽魂值占用了多少字节。 如果是4个字节最好了，因为要进行筛选的选项要少得多。 但是，我们目前还不能做这个假设。 我们也要寻找可写但不可执行的内存。

然后，单击 **首次扫描**。

这可能会为您提供一大堆值为80的内存地址。 但这是一个好的开端！

![cheat engine found screenshot](../../images/cheatengine_found.png)

这是所有这些内存地址的实时视图。 一旦值被更改就会变为红色。 其中一些值在不停地闪烁，即使我们完全没有在游戏中做任何事情，它们也在不断变化。 您可以多次使用 **再次扫描** 以重复扫描并舍弃这些值。

### 再次扫描

在游戏中使用裂石飞环使兽魂降低到30。

切换到Cheat Engine。 将 **数值** 更改为30。 单击 **再次扫描**。 这将大大减少内存地址的数量。

重复此过程，改变游戏中的兽魂值，然后重新扫描新的值，直到地址的数量降低到只有几个为止。

![cheat engine post scan screenshot](../../images/cheatengine_postscan.png)

其中，黑色的地址是堆地址。 而绿色的地址是 [静态地址](https://medium.com/@nickteixeira/stack-vs-heap-whats-the-difference-and-why-should-i-care-5abc78da1a88)。 在一般情况下，你应当使用静态地址。 因为引用它的代码更容易寻找，并且这些地址通常是永久性的。

继续扫描，直到找到唯一的绿色的静态地址。

右键单击地址，然后选择 **将选中的地址添加到地址列表**。 地址会出现在底部的列表。 在我们的例子里，这个静态地址是 `14116E128`。

![cheat engine address list screenshot](../../images/cheatengine_addresslist.png)

如果您正在按照此示例进行操作，则您所得到的静态地址很可能与此不同。 不仅如此，每次在您重新启动游戏时，这个地址都会变化。 这是因为Windows启用了 [地址空间布局随机化](https://en.wikipedia.org/wiki/Address_space_layout_randomization) ，很大程度上使得难以进行我们现在正在做的事情。

这也是我们需要找到内存签名的原因。 如果可执行文件和DLL地址布局没有随机化，则静态地址在每次运行时都是一致的。

### 浏览内存

在地址列表中，右键单击我们刚刚添加的地址，然后选择**浏览相关内存区域**。

这将会打开“内存浏览器”窗口。 此窗口的顶部是反汇编视图，底部是内存浏览器。 但是令人困惑的是，即使位于同一窗口中，这些视图的功能是互不干扰的，也 *不会* 同步。 They will sync to whatever the last address you have selected **Disassemble This Memory Region** or **Browse This Memory Region** on respectively.

![cheat engine browse memory screenshot](images/cheatengine_browsememory.png)

However, you can see that in the top left of this screenshot is the hex value `1E`, which is [30 in decimal](https://www.google.com/search?q=0x1e+in+decimal).

Browsing memory can let you see what else is around it. This is especially useful for things like entity or player data.

For job data, there's really not much interesting in nearby memory.

### 方法1：找出写内存的代码

Now, we need to find some code that refers to this. The easiest way to do this is to find what modifies this value.

Right click on the address in the address list, and select **Find out what writes to this address**. This will ask you to attach the debugger, say yes. A new window will pop up.

Go back to FFXIV, and modify the beast gauge. In this case, we'll hit infuriate to go from 30 to 80.

Go back to Cheat Engine, and the new debugger window should have some information.

![cheat engine debugger screenshot](images/cheatengine_debugger.png)

This is the assembly that wrote to the beast gauge memory location.

If you want, you can click on the **Show disassembler** to see the surrounding code.

![cheat engine disassembly screenshot](images/cheatengine_disassembly.png)

Unfortunately, in this case, this is a two instruction function call.

The line that is changing the value is `mov [rcx+08], al`. I don't really know assembly language, but google tells me that `al` is the last 8 bits of the `eax` register which was set on the previous `movzx eax, byte ptr [rdx+01]` line. Given that this is the line that is writing memory, `[rcx+08]` is the pointer we care about, but we need to find the calling code that set `rcx`. This code is likely somewhere very different in the executable.

We have a couple of different options here. One option here is to [do a trace to find calling code](#approach-2-tracing). The second option is to [consider what reads the address](#approach-3-finding-readers) and not just write. A third option (not explored in this guide) is to find some other code path that modifies the value, and see if that code path has an easier signature. (For example, changing jobs likely modifies the value in a different way?)

### 方法2：跟踪

If pure disassembly doesn't yield enough contextual information, Cheat Engine has "break and trace" functionality. Go back to the [browsing memory](#browsing-memory) view. This functionality is not available from the address list directly.

Right click on that `1E` byte you care about. Select **Data Breakpoint** and then **Break and trace**. All the default options are fine. Since we are still looking for a writer, we will keep **Break on Write** selected. Click **Ok**.

This brings you to a Tracer window. Go back to Final Fantasy, and do something to modify your beast gauge. The game will probably hiccup as Cheat Engine tries to record callstacks. Go back to the Tracer window.

![cheat engine tracing screenshot](images/cheatengine_tracing.png)

You can double click on the lines in the Tracer to have the Memory Viewer disassembly window jump to that location.

In this case, expanding the arrow and double clicking the `ret` return assembly instruction goes back to exactly what we were looking at before in the disassembly window.

Double clicking on `mov rdx, [rsp+50]` brings us to the code that called the code we were looking at before.

![cheat engine tracing 2 screenshot](images/cheatengine_tracing2.png)

The `call` right before that line is the `call` into the code we were looking at. So, we would need to figure out what set `rcx`. It looks like that's set from `r9`. `r9` is set indirectly from a pointer in `r14`. This is getting complicated. It's possible to keep going back in the assembly to find some code, but maybe there's an easier approach.

### 方法3：找出读内存的代码

Instead of finding code that modifies the value, we could also find code that reads the value.

Right click on the address in the address list, and select **Find out what accesses this address**.

Unlike writing, the code is likely constantly accessing this address. You will need to hit the **Stop** button to stop collecting locations.

![cheat engine debugger 2 screenshot](images/cheatengine_debugger2.png)

In this case, there are two places in code that are accessing this memory. One is hit very frequently (3000 times) and the other infrequently (152).

Looking at the disassembly in the window, the second one looks like a much more substantial function, so let's disassemble that one.

![cheat engine disassembly 2 screenshot](images/cheatengine_disassembly2.png)

Perfect! This looks a bit simpler than the code we saw in tracing.

### 汇编代码和指针

Because we are looking for a static address, this address will never change once the program has started. The goal is to find some stable set of assembly code that surrounds the address we're looking for. We can then search for this code in memory to get back the address, no matter where it is that particular run.

Reading this assembly code, the reading code is `movzx ebx, byte ptr [rcx+08]`. In English, this looks at the memory location 8 bytes after what is in the `rcx` register, takes the byte found there, and moves it into the `ebx` register. (The movzx part means that it [zero extends](https://www.felixcloutier.com/x86/movzx) this value, which is not very relevant to what we're doing.)

Since it's looking at `rcx`, we need to look backwards in the assembly code until we find the line that sets `rcx`. You can see that `rcx` gets set on the `mov rcx,[ffxiv_dx11.exe+1AAE118]` line. This means that `rcx` is set from whatever is stored in memory at that location.

```assembly
48 8B 0D 23C14201     - mov rcx,[ffxiv_dx11.exe+1AAE118] { (14116E120) }
48 85 C9              - test rcx,rcx
74 B8                 - je ffxiv_dx11.exe+681FB2
48 8B 05 67C14201     - mov rax,[ffxiv_dx11.exe+1AAE168] { (21) }
```

In particular, the `23C14201` value is what we are looking for. Here's a brief digression on RIP relative addressing modes. RIP relative addressing means that offsets are relative to the instruction pointer. The `RIP` register is the instruction pointer register and contains the address of the instruction immediately following this instruction. You can find out what this address is by double clicking on the next line (the `text rcx,rcx` line). In my case, it says the address is `13FD41FF5`. Because we are on a [little endian](https://en.wikipedia.org/wiki/Endianness) system, the `23C14201` hex is the 4 byte integer `01 42 C1 23` (bytes reversed). If you [add](https://www.google.com/search?q=0x0142C123+%2B+0x13FD41FF5) 0x0142C123 + 0x13FD41FF5, you get 0x14116E118. Cheat Engine will also calculate this number for you if you just double click on the instruction itself. For instance, double clicking on the `mov rcx` line yields the text `mov rcx,[14116E118]`. So, you don't have to do this math at all, but it's good to know how it works.

In the comment from Cheat Engine, that `mov rcx` line has the value `14116E120`. This means that the memory address at `14116E118` has the value `14116E120`. The memory address we found earlier when scanning was `14116E128`. So it makes sense that `14116E120 + 08` is the value we want, as the reading code adds 8 bytes to its address.

You can manually add `14116E118` to the memory region or just find it relative to the beast gauge, as it's very close.

![cheat engine pointer screenshot](images/cheatengine_pointer.png)

In the above screenshot, the small circle is the beast gauge values at `14116E128` and the longer circle is the pointer at `14116E118` that is being used to load `rcx`. This memory browsing confirms the comment earlier, that the memory at `14116E118` contains the pointer `000000014116E120`. (As always, little endian means reversing the bytes.)

### 从汇编代码中提取签名

So, now we have some assembly code that contains a pointer to a pointer to the beast gauge. We need to pick out some bytes from the assembly code to serve as the signature.

There's a little bit of an art to picking good signatures. You want to always want to ignore relative pointer offsets, like the `23C14201` value from before. These offsets will be the same from run to run, but change from patch to patch with great frequency. Finding signatures is a huge pain, so ideally you want to find something that will stand the test of time.

In this case, let's just start copying bytes out from the bytes column, starting with the `mov rcx, ...` line.

```assembly
48 8B 0D 23C14201     - mov rcx,[ffxiv_dx11.exe+1AAE118] { (14116E120) }
48 85 C9              - test rcx,rcx
74 B8                 - je ffxiv_dx11.exe+681FB2
48 8B 05 67C14201     - mov rax,[ffxiv_dx11.exe+1AAE168] { (21) }
```

This gives us: `48 8B 0D 23C14201 48 85 C9 74 B8 48 8B 05 67C14201`

The two four byte patterns are both pointers, so let's just drop the one on the end and make the internal one a wildcard. You can make wildcards using question marks, both in cactbot and in Cheat Engine.

Thus, our final signature is: `488B0D????????4885C974B8488B05`

The address that contains the pointer we care about is the four bytes in the question mark.

You can see this [in cactbot itself](https://github.com/quisquous/cactbot/blob/df176c4feff81bab356a8e5e6e6b453e94626320/CactbotOverlay/FFXIVProcess.cs#L189).

It's important to do a [scan for existing memory signatures](#scan-for-existing-memory-signatures) to make sure that this signature is unique.

Then, in your plugin, the process would be the following.

* search for this signature in memory
* convert the RIP relative addressing to a real pointer (e.g. `14116E118`)
* find the pointer at that memory location (e.g. `14116E120`)
* this pointer is the pointer to beast gauge

Because `14116E118` points 8 bytes forward to `14116E120`, we could just also make the assumption that this is always true and just add 16 bytes to what we find in the signature. This has been true through all of Stormblood, at least.

Foof.

## 扫描现有的内存签名

If you have an existing memory signature, you can also use Cheat Engine to find it in memory.

![cheat engine signature scan screenshot](images/cheatengine_signature_scan.png)

Start another scan. This time, set the **Value Type** to **Array of byte**, and select **Search for this array**. Click the **Hex** checkmark, and paste in the signature that we got previously. Make sure to click the **Executable** checkmark, as we are searching for code.

If you click **First scan**, this should find a single result. If you right click that address, and select **Disassemble this address** it will bring you right back to the code that we found previously.
